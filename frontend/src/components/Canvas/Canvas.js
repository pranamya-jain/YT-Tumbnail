import React, { useRef, useEffect, useState } from 'react';
import { useThumbnail } from '../../contexts/ThumbnailContext';
import { Button } from '../ui/button';
import { Upload, Type } from 'lucide-react';
import TextEditOverlay from './TextEditOverlay';

const Canvas = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const { state, dispatch } = useThumbnail();
  const [draggedLayer, setDraggedLayer] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [editingLayer, setEditingLayer] = useState(null);
  const [editPosition, setEditPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });
  const [lastClickTime, setLastClickTime] = useState(0);
  const fileInputRef = useRef(null);

  // Helper function to get canvas coordinates from mouse event
  const getCanvasCoordinates = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
      scaleX,
      scaleY
    };
  };

  // Helper function to find text layer at coordinates
  const findTextLayerAt = (x, y) => {
    // Check layers in reverse order (top to bottom)
    for (let i = state.textLayers.length - 1; i >= 0; i--) {
      const layer = state.textLayers[i];
      if (layer.type === 'text') {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.font = `${layer.style.fontWeight || 'normal'} ${layer.style.fontSize}px ${layer.style.fontFamily}`;
        const textMetrics = ctx.measureText(layer.content);
        const textHeight = layer.style.fontSize;
        
        if (x >= layer.position.x && x <= layer.position.x + textMetrics.width &&
            y >= layer.position.y && y <= layer.position.y + textHeight) {
          return layer;
        }
      }
    }
    return null;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = state.canvas.width;
    canvas.height = state.canvas.height;

    // Clear canvas
    ctx.fillStyle = state.canvas.backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw background image if exists
    if (state.backgroundImage) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        drawTextLayers(ctx);
      };
      img.src = state.backgroundImage;
    } else {
      drawTextLayers(ctx);
    }
  }, [state.canvas, state.backgroundImage, state.textLayers, state.selectedLayer]);

  // Handle mouse down - start potential drag or select
  const handleCanvasMouseDown = (e) => {
    const coords = getCanvasCoordinates(e);
    const clickedLayer = findTextLayerAt(coords.x, coords.y);
    
    if (clickedLayer) {
      // Select the layer
      dispatch({
        type: 'SELECT_LAYER',
        payload: clickedLayer.id
      });

      // Prepare for potential drag
      setDraggedLayer(clickedLayer);
      setDragStartPos({ x: coords.x, y: coords.y });
      setDragOffset({
        x: coords.x - clickedLayer.position.x,
        y: coords.y - clickedLayer.position.y
      });

      // Track for double-click detection
      const currentTime = Date.now();
      const timeDiff = currentTime - lastClickTime;
      setLastClickTime(currentTime);

      // If it's a double-click (within 300ms), start editing
      if (timeDiff < 300) {
        const domX = (clickedLayer.position.x / coords.scaleX);
        const domY = (clickedLayer.position.y / coords.scaleY);
        
        setEditPosition({ x: domX, y: domY });
        setEditingLayer(clickedLayer);
        setDraggedLayer(null); // Cancel drag for editing
      }
    } else {
      // Clicked on empty area
      dispatch({
        type: 'SELECT_LAYER',
        payload: null
      });
      setEditingLayer(null);
      setDraggedLayer(null);
    }
  };

  // Handle mouse move - perform drag if in progress
  const handleCanvasMouseMove = (e) => {
    if (!draggedLayer || editingLayer) return;

    const coords = getCanvasCoordinates(e);
    const dragDistance = Math.sqrt(
      Math.pow(coords.x - dragStartPos.x, 2) + 
      Math.pow(coords.y - dragStartPos.y, 2)
    );

    // Start dragging if mouse moved more than 5 pixels
    if (dragDistance > 5 && !isDragging) {
      setIsDragging(true);
      document.body.style.cursor = 'grabbing';
    }

    if (isDragging) {
      // Calculate new position with boundary constraints
      const newX = Math.max(0, Math.min(
        coords.x - dragOffset.x,
        state.canvas.width - 200 // Leave some margin for text
      ));
      const newY = Math.max(draggedLayer.style.fontSize, Math.min(
        coords.y - dragOffset.y,
        state.canvas.height - 20
      ));

      // Update layer position
      dispatch({
        type: 'UPDATE_TEXT_LAYER',
        payload: {
          id: draggedLayer.id,
          updates: {
            position: { x: newX, y: newY }
          }
        }
      });
    }
  };

  // Handle mouse up - end drag
  const handleCanvasMouseUp = (e) => {
    if (isDragging) {
      setIsDragging(false);
      document.body.style.cursor = 'default';
    }
    setDraggedLayer(null);
  };

  // Handle mouse leave - cancel drag
  const handleCanvasMouseLeave = (e) => {
    if (isDragging) {
      setIsDragging(false);
      document.body.style.cursor = 'default';
    }
    setDraggedLayer(null);
  };

  const drawTextLayers = (ctx) => {
    state.textLayers.forEach(layer => {
      if (layer.type === 'text') {
        ctx.save();
        
        // Apply text styles
        const style = layer.style;
        ctx.font = `${style.fontWeight || 'normal'} ${style.fontSize}px ${style.fontFamily}`;
        ctx.fillStyle = style.color;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';

        // Add shadow if exists
        if (style.textShadow) {
          const shadowParts = style.textShadow.match(/([+-]?\d*\.?\d+)px\s+([+-]?\d*\.?\d+)px\s+([+-]?\d*\.?\d+)px\s+(.*)/);
          if (shadowParts) {
            ctx.shadowOffsetX = parseFloat(shadowParts[1]);
            ctx.shadowOffsetY = parseFloat(shadowParts[2]);
            ctx.shadowBlur = parseFloat(shadowParts[3]);
            ctx.shadowColor = shadowParts[4];
          }
        }

        // Draw text
        ctx.fillText(layer.content, layer.position.x, layer.position.y);

        // Add stroke if exists
        if (style.stroke && style.strokeWidth) {
          ctx.strokeStyle = style.stroke;
          ctx.lineWidth = style.strokeWidth;
          ctx.strokeText(layer.content, layer.position.x, layer.position.y);
        }

        // Draw selection outline if selected
        if (state.selectedLayer === layer.id) {
          const textMetrics = ctx.measureText(layer.content);
          const textHeight = style.fontSize;
          ctx.setLineDash([5, 5]);
          ctx.strokeStyle = '#ff0000';
          ctx.lineWidth = 2;
          ctx.strokeRect(
            layer.position.x - 5,
            layer.position.y - 5,
            textMetrics.width + 10,
            textHeight + 10
          );
          ctx.setLineDash([]);
        }

        ctx.restore();
      }
    });
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        dispatch({
          type: 'SET_BACKGROUND_IMAGE',
          payload: e.target.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      const reader = new FileReader();
      reader.onload = (event) => {
        dispatch({
          type: 'SET_BACKGROUND_IMAGE',
          payload: event.target.result
        });
      };
      reader.readAsDataURL(imageFile);
    }
  };

  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    // Check if clicking on a text layer
    let clickedLayer = null;
    state.textLayers.forEach(layer => {
      if (layer.type === 'text') {
        const ctx = canvas.getContext('2d');
        ctx.font = `${layer.style.fontWeight || 'normal'} ${layer.style.fontSize}px ${layer.style.fontFamily}`;
        const textMetrics = ctx.measureText(layer.content);
        const textHeight = layer.style.fontSize;
        
        if (x >= layer.position.x && x <= layer.position.x + textMetrics.width &&
            y >= layer.position.y && y <= layer.position.y + textHeight) {
          clickedLayer = layer.id;
        }
      }
    });

    dispatch({
      type: 'SELECT_LAYER',
      payload: clickedLayer
    });

    // Close text editing if clicking elsewhere
    if (!clickedLayer) {
      setEditingLayer(null);
    }
  };

  const handleCanvasDoubleClick = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    // Check if double-clicking on a text layer
    let clickedLayer = null;
    state.textLayers.forEach(layer => {
      if (layer.type === 'text') {
        const ctx = canvas.getContext('2d');
        ctx.font = `${layer.style.fontWeight || 'normal'} ${layer.style.fontSize}px ${layer.style.fontFamily}`;
        const textMetrics = ctx.measureText(layer.content);
        const textHeight = layer.style.fontSize;
        
        if (x >= layer.position.x && x <= layer.position.x + textMetrics.width &&
            y >= layer.position.y && y <= layer.position.y + textHeight) {
          clickedLayer = layer;
        }
      }
    });

    if (clickedLayer) {
      // Convert canvas coordinates to DOM coordinates for input positioning
      const domX = (clickedLayer.position.x / scaleX);
      const domY = (clickedLayer.position.y / scaleY);
      
      setEditPosition({ x: domX, y: domY });
      setEditingLayer(clickedLayer);
      
      dispatch({
        type: 'SELECT_LAYER',
        payload: clickedLayer.id
      });
    }
  };

  const handleTextSave = (newText) => {
    if (editingLayer) {
      dispatch({
        type: 'UPDATE_TEXT_LAYER',
        payload: {
          id: editingLayer.id,
          updates: { content: newText }
        }
      });
    }
    setEditingLayer(null);
  };

  const handleTextCancel = () => {
    setEditingLayer(null);
  };

  const addTextLayer = () => {
    dispatch({
      type: 'ADD_TEXT_LAYER',
      payload: {
        content: 'Double-click to edit',
        position: { x: 100, y: 100 }
      }
    });
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* Canvas Container */}
      <div className="relative" ref={containerRef}>
        <canvas
          ref={canvasRef}
          id="thumbnail-canvas"
          className={`border-2 rounded-lg shadow-2xl cursor-pointer transition-all duration-300 ${
            isDragOver ? 'border-red-500 border-dashed' : 'border-border'
          } hover:shadow-3xl`}
          style={{
            width: '640px',
            height: '360px',
            backgroundColor: state.canvas.backgroundColor
          }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleCanvasClick}
          onDoubleClick={handleCanvasDoubleClick}
        />
        
        {/* Text Edit Overlay */}
        {editingLayer && (
          <TextEditOverlay
            layer={editingLayer}
            position={editPosition}
            onSave={handleTextSave}
            onCancel={handleTextCancel}
            canvasScale={{
              width: canvasRef.current?.getBoundingClientRect().width || 640,
              height: canvasRef.current?.getBoundingClientRect().height || 360
            }}
          />
        )}
        
        {/* Overlay for empty canvas */}
        {!state.backgroundImage && state.textLayers.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <div className="text-center space-y-4 opacity-50">
              <Upload className="h-16 w-16 mx-auto text-muted-foreground" />
              <p className="text-xl font-medium">Drop an image here</p>
              <p className="text-sm text-muted-foreground">or click below to upload</p>
            </div>
          </div>
        )}

        {/* Drag overlay */}
        {isDragOver && (
          <div className="absolute inset-0 bg-red-500/20 border-2 border-red-500 border-dashed rounded-lg flex items-center justify-center">
            <div className="text-center">
              <Upload className="h-12 w-12 mx-auto text-red-500 mb-2" />
              <p className="text-red-500 font-medium">Drop image here</p>
            </div>
          </div>
        )}
      </div>

      {/* Canvas Actions */}
      <div className="flex items-center space-x-4">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />
        <Button
          onClick={() => fileInputRef.current?.click()}
          variant="outline"
          className="hover:scale-105 transition-transform"
        >
          <Upload className="h-4 w-4 mr-2" />
          Upload Image
        </Button>
        <Button
          onClick={addTextLayer}
          className="bg-red-600 hover:bg-red-700 hover:scale-105 transition-all"
        >
          <Type className="h-4 w-4 mr-2" />
          Add Text
        </Button>
      </div>

      {/* Canvas Info */}
      <div className="text-sm text-muted-foreground text-center">
        Canvas: 1280×720 (YouTube Standard) • Zoom: 50%
      </div>
    </div>
  );
};

export default Canvas;