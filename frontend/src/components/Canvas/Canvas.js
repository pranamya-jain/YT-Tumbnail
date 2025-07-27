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
  const fileInputRef = useRef(null);

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
  }, [state.canvas, state.backgroundImage, state.textLayers]);

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
        content: 'Click to edit',
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