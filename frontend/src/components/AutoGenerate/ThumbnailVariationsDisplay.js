import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Download, Edit, Copy, Star, Shuffle, Zap } from 'lucide-react';

const ThumbnailVariationsDisplay = ({ variations, onSwitchToManual }) => {
  const [selectedVariation, setSelectedVariation] = useState(null);
  const canvasRefs = useRef({});

  useEffect(() => {
    // Render all variations when component mounts
    variations.forEach(variation => {
      if (canvasRefs.current[variation.id]) {
        renderVariationOnCanvas(canvasRefs.current[variation.id], variation);
      }
    });
  }, [variations]);

  const renderVariationOnCanvas = async (canvas, variation) => {
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = 320;
    canvas.height = 180;

    // Clear canvas
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    try {
      // Draw background image
      if (variation.backgroundImage) {
        const img = new Image();
        img.onload = () => {
          // Draw image to fit canvas
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          
          // Apply overlay
          if (variation.overlay) {
            applyOverlay(ctx, variation.overlay, canvas.width, canvas.height);
          }
          
          // Draw text
          drawVariationText(ctx, variation, canvas.width, canvas.height);
        };
        img.src = variation.backgroundImage;
      } else {
        // Draw text without background
        drawVariationText(ctx, variation, canvas.width, canvas.height);
      }
    } catch (error) {
      console.error('Error rendering variation:', error);
    }
  };

  const applyOverlay = (ctx, overlay, width, height) => {
    ctx.save();
    
    switch (overlay.type) {
      case 'gradient':
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        overlay.stops.forEach(stop => {
          gradient.addColorStop(stop.position, stop.color);
        });
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        break;
      
      case 'solid':
        ctx.fillStyle = overlay.color;
        ctx.fillRect(0, 0, width, height);
        break;
      
      default:
        // Default dark overlay for text readability
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.fillRect(0, 0, width, height);
    }
    
    ctx.restore();
  };

  const drawVariationText = (ctx, variation, canvasWidth, canvasHeight) => {
    ctx.save();
    
    const textStyle = variation.textStyle;
    const layout = variation.layout;
    
    // Set font
    const fontSize = Math.floor(textStyle.fontSize * 0.25); // Scale down for preview
    ctx.font = `${textStyle.fontWeight} ${fontSize}px ${textStyle.fontFamily}`;
    ctx.fillStyle = textStyle.color;
    ctx.textAlign = layout.textAlign || 'center';
    
    // Add stroke if specified
    if (textStyle.stroke) {
      ctx.strokeStyle = textStyle.stroke;
      ctx.lineWidth = textStyle.strokeWidth || 2;
    }
    
    // Calculate text position
    let x = canvasWidth / 2;
    let y = canvasHeight / 2;
    
    switch (layout.textPosition) {
      case 'top':
        y = fontSize + 20;
        break;
      case 'bottom':
        y = canvasHeight - 20;
        break;
      case 'left':
        x = 20;
        ctx.textAlign = 'left';
        break;
      case 'right':
        x = canvasWidth - 20;
        ctx.textAlign = 'right';
        break;
      case 'top-left':
        x = 20;
        y = fontSize + 20;
        ctx.textAlign = 'left';
        break;
      case 'top-right':
        x = canvasWidth - 20;
        y = fontSize + 20;
        ctx.textAlign = 'right';
        break;
      case 'bottom-left':
        x = 20;
        y = canvasHeight - 20;
        ctx.textAlign = 'left';
        break;
      case 'bottom-right':
        x = canvasWidth - 20;
        y = canvasHeight - 20;
        ctx.textAlign = 'right';
        break;
    }
    
    // Handle multi-line text
    const maxWidth = canvasWidth * 0.8;
    const lines = wrapText(ctx, variation.title, maxWidth);
    const lineHeight = fontSize * 1.2;
    const totalHeight = lines.length * lineHeight;
    let startY = y - (totalHeight / 2);
    
    if (layout.textPosition?.includes('top')) {
      startY = y;
    } else if (layout.textPosition?.includes('bottom')) {
      startY = y - totalHeight;
    }
    
    lines.forEach((line, index) => {
      const lineY = startY + (index * lineHeight);
      
      if (textStyle.stroke) {
        ctx.strokeText(line, x, lineY);
      }
      ctx.fillText(line, x, lineY);
    });
    
    ctx.restore();
  };

  const wrapText = (ctx, text, maxWidth) => {
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const metrics = ctx.measureText(testLine);
      
      if (metrics.width > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    
    if (currentLine) {
      lines.push(currentLine);
    }
    
    return lines;
  };

  const handleDownload = (variation) => {
    // Create a high-res version for download
    const downloadCanvas = document.createElement('canvas');
    downloadCanvas.width = 1280;
    downloadCanvas.height = 720;
    
    renderVariationOnCanvas(downloadCanvas, {
      ...variation,
      textStyle: {
        ...variation.textStyle,
        fontSize: variation.textStyle.fontSize // Use full size for download
      }
    });
    
    // Download the canvas as image
    downloadCanvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = `thumbnail-${variation.name.toLowerCase().replace(/\s+/g, '-')}.png`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
    }, 'image/png');
  };

  const handleCopyVariation = (variation) => {
    // Create a duplicate with slight modifications
    const duplicatedVariation = {
      ...variation,
      id: `${variation.id}-copy-${Date.now()}`,
      name: `${variation.name} Copy`,
      textStyle: {
        ...variation.textStyle,
        color: variation.textStyle.color === '#ffffff' ? '#00ff41' : '#ffffff'
      }
    };
    
    // Add to variations (would need to be handled by parent component)
    console.log('Copy variation:', duplicatedVariation);
  };

  const getBadgeColor = (templateId) => {
    const colors = {
      'bold-center': 'bg-red-500',
      'top-banner': 'bg-blue-500',
      'side-split': 'bg-green-500',
      'bottom-overlay': 'bg-purple-500',
      'corner-emphasis': 'bg-orange-500'
    };
    return colors[templateId] || 'bg-gray-500';
  };

  const getPerformanceScore = () => {
    return Math.floor(Math.random() * 30) + 70; // Mock performance score
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center space-x-2">
            <Zap className="h-6 w-6 text-yellow-500" />
            <span>Generated Thumbnails</span>
          </h2>
          <p className="text-muted-foreground mt-1">
            Choose a variation to customize or download directly
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            {variations.length} Variations
          </Badge>
        </div>
      </div>

      {/* Variations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {variations.map((variation, index) => (
          <Card
            key={variation.id}
            className={`group cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 ${
              selectedVariation?.id === variation.id
                ? 'ring-2 ring-primary ring-offset-2'
                : ''
            }`}
            onClick={() => setSelectedVariation(variation)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center space-x-2">
                  <span>{variation.name}</span>
                  {index === 0 && (
                    <Badge className="text-xs bg-yellow-100 text-yellow-800">
                      <Star className="h-3 w-3 mr-1" />
                      Popular
                    </Badge>
                  )}
                </CardTitle>
                <Badge 
                  className={`text-xs text-white ${getBadgeColor(variation.id)}`}
                >
                  {getPerformanceScore()}% CTR
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Canvas Preview */}
              <div className="relative overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
                <canvas
                  ref={el => canvasRefs.current[variation.id] = el}
                  className="w-full h-auto transition-transform group-hover:scale-105"
                  style={{ aspectRatio: '16/9' }}
                />
                
                {/* Overlay Actions */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSwitchToManual(variation);
                    }}
                    className="bg-white/90 hover:bg-white text-black"
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload(variation);
                    }}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    <Download className="h-3 w-3 mr-1" />
                    Download
                  </Button>
                </div>
              </div>

              {/* Variation Info */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Layout: {variation.layout?.textPosition || 'center'}</span>
                  <span>Font: {variation.textStyle?.fontSize}px</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                    style={{ backgroundColor: variation.textStyle?.color }}
                  ></div>
                  <span className="text-xs text-muted-foreground">
                    {variation.textStyle?.fontFamily}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSwitchToManual(variation);
                  }}
                  className="flex-1"
                >
                  <Edit className="h-3 w-3 mr-1" />
                  Customize
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopyVariation(variation);
                  }}
                >
                  <Copy className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownload(variation);
                  }}
                  className="bg-red-600 hover:bg-red-700"
                >
                  <Download className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Batch Actions */}
      {variations.length > 0 && (
        <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 border-purple-200 dark:border-purple-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Shuffle className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="font-medium text-purple-900 dark:text-purple-100">
                    Batch Actions
                  </p>
                  <p className="text-sm text-purple-700 dark:text-purple-300">
                    Download all variations or generate more
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-purple-300 text-purple-700 hover:bg-purple-100"
                >
                  Download All
                </Button>
                <Button
                  size="sm"
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Generate More
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ThumbnailVariationsDisplay;