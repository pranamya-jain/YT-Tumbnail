import React from 'react';
import { useThumbnail } from '../../contexts/ThumbnailContext';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { Badge } from '../ui/badge';
import { 
  Type, 
  Image, 
  Palette, 
  Move, 
  RotateCcw, 
  RotateCw,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline
} from 'lucide-react';

const Toolbar = () => {
  const { state, dispatch } = useThumbnail();
  const selectedLayer = state.textLayers.find(layer => layer.id === state.selectedLayer);

  const addTextLayer = () => {
    dispatch({
      type: 'ADD_TEXT_LAYER',
      payload: {
        content: 'New Text',
        position: { x: Math.random() * 300 + 100, y: Math.random() * 200 + 100 }
      }
    });
  };

  const toggleBold = () => {
    if (selectedLayer) {
      const currentWeight = selectedLayer.style.fontWeight;
      const newWeight = currentWeight === '700' || currentWeight === 'bold' ? '400' : '700';
      dispatch({
        type: 'UPDATE_TEXT_LAYER',
        payload: {
          id: selectedLayer.id,
          updates: {
            style: { ...selectedLayer.style, fontWeight: newWeight }
          }
        }
      });
    }
  };

  const quickColorChange = (color) => {
    if (selectedLayer) {
      dispatch({
        type: 'UPDATE_TEXT_LAYER',
        payload: {
          id: selectedLayer.id,
          updates: {
            style: { ...selectedLayer.style, color }
          }
        }
      });
    }
  };

  const quickFontSizeChange = (sizeChange) => {
    if (selectedLayer) {
      const newSize = Math.max(12, Math.min(120, selectedLayer.style.fontSize + sizeChange));
      dispatch({
        type: 'UPDATE_TEXT_LAYER',
        payload: {
          id: selectedLayer.id,
          updates: {
            style: { ...selectedLayer.style, fontSize: newSize }
          }
        }
      });
    }
  };

  return (
    <div className="border-b border-border bg-card/50 backdrop-blur-sm">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Left Side - Tool Groups */}
        <div className="flex items-center space-x-4">
          {/* Add Elements */}
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={addTextLayer}
              className="hover:scale-105 transition-transform"
            >
              <Type className="h-4 w-4 mr-1" />
              Text
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled
              className="opacity-50"
            >
              <Image className="h-4 w-4 mr-1" />
              Shape
            </Button>
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* Text Formatting - Only show when text is selected */}
          {selectedLayer && (
            <>
              <div className="flex items-center space-x-1">
                <Button
                  variant={selectedLayer.style.fontWeight === '700' || selectedLayer.style.fontWeight === 'bold' ? 'default' : 'outline'}
                  size="sm"
                  onClick={toggleBold}
                  className="hover:scale-105 transition-transform"
                >
                  <Bold className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled
                  className="opacity-50"
                >
                  <Italic className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled
                  className="opacity-50"
                >
                  <Underline className="h-4 w-4" />
                </Button>
              </div>

              <Separator orientation="vertical" className="h-6" />

              {/* Font Size Quick Controls */}
              <div className="flex items-center space-x-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => quickFontSizeChange(-4)}
                  className="hover:scale-105 transition-transform px-2"
                >
                  A-
                </Button>
                <span className="text-sm text-muted-foreground px-2">
                  {selectedLayer.style.fontSize}px
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => quickFontSizeChange(4)}
                  className="hover:scale-105 transition-transform px-2"
                >
                  A+
                </Button>
              </div>

              <Separator orientation="vertical" className="h-6" />

              {/* Quick Colors */}
              <div className="flex items-center space-x-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => quickColorChange('#ffffff')}
                  className="hover:scale-105 transition-transform p-1"
                >
                  <div className="w-5 h-5 bg-white border rounded"></div>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => quickColorChange('#000000')}
                  className="hover:scale-105 transition-transform p-1"
                >
                  <div className="w-5 h-5 bg-black rounded"></div>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => quickColorChange('#ff0000')}
                  className="hover:scale-105 transition-transform p-1"
                >
                  <div className="w-5 h-5 bg-red-500 rounded"></div>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => quickColorChange('#00ff41')}
                  className="hover:scale-105 transition-transform p-1"
                >
                  <div className="w-5 h-5 bg-green-400 rounded"></div>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => quickColorChange('#0066cc')}
                  className="hover:scale-105 transition-transform p-1"
                >
                  <div className="w-5 h-5 bg-blue-600 rounded"></div>
                </Button>
              </div>

              <Separator orientation="vertical" className="h-6" />
            </>
          )}

          {/* Alignment Tools */}
          <div className="flex items-center space-x-1">
            <Button
              variant="outline"
              size="sm"
              disabled
              className="opacity-50"
            >
              <AlignLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled
              className="opacity-50"
            >
              <AlignCenter className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled
              className="opacity-50"
            >
              <AlignRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Right Side - Status and Info */}
        <div className="flex items-center space-x-4">
          {selectedLayer && (
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="text-xs">
                <Type className="h-3 w-3 mr-1" />
                Text Selected
              </Badge>
              <Badge variant="outline" className="text-xs">
                {selectedLayer.style.fontFamily} {selectedLayer.style.fontSize}px
              </Badge>
            </div>
          )}
          
          <Badge variant="outline" className="text-xs">
            {state.textLayers.length} layers
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default Toolbar;