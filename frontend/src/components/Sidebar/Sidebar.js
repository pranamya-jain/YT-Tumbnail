import React, { useState } from 'react';
import { useThumbnail } from '../../contexts/ThumbnailContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Slider } from '../ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { 
  Type, 
  Palette, 
  Layers, 
  Settings,
  Trash2,
  Copy,
  Eye,
  EyeOff
} from 'lucide-react';

const Sidebar = () => {
  const { state, dispatch } = useThumbnail();
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  
  const selectedLayer = state.textLayers.find(layer => layer.id === state.selectedLayer);

  const updateSelectedLayer = (updates) => {
    if (selectedLayer) {
      dispatch({
        type: 'UPDATE_TEXT_LAYER',
        payload: {
          id: selectedLayer.id,
          updates
        }
      });
    }
  };

  const updateLayerStyle = (styleUpdates) => {
    if (selectedLayer) {
      updateSelectedLayer({
        style: { ...selectedLayer.style, ...styleUpdates }
      });
    }
  };

  const deleteLayer = (layerId) => {
    dispatch({
      type: 'DELETE_TEXT_LAYER',
      payload: layerId
    });
  };

  const duplicateLayer = (layer) => {
    dispatch({
      type: 'ADD_TEXT_LAYER',
      payload: {
        content: layer.content,
        position: { x: layer.position.x + 20, y: layer.position.y + 20 },
        style: { ...layer.style }
      }
    });
  };

  const applyPreset = (preset) => {
    if (selectedLayer) {
      updateLayerStyle(preset.style);
    }
  };

  return (
    <div className="h-full overflow-y-auto">
      <Tabs defaultValue="layers" className="w-full">
        <TabsList className="grid w-full grid-cols-4 m-4">
          <TabsTrigger value="layers" className="text-xs">
            <Layers className="h-3 w-3 mr-1" />
            Layers
          </TabsTrigger>
          <TabsTrigger value="text" className="text-xs">
            <Type className="h-3 w-3 mr-1" />
            Text
          </TabsTrigger>
          <TabsTrigger value="effects" className="text-xs">
            <Palette className="h-3 w-3 mr-1" />
            Effects
          </TabsTrigger>
          <TabsTrigger value="settings" className="text-xs">
            <Settings className="h-3 w-3 mr-1" />
            Canvas
          </TabsTrigger>
        </TabsList>

        <div className="px-4 space-y-4">
          {/* Layers Panel */}
          <TabsContent value="layers" className="space-y-3">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Layers</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {/* Background Layer */}
                <div className="flex items-center justify-between p-2 rounded bg-muted/50">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded border"></div>
                    <span className="text-sm">Background</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">BG</Badge>
                </div>

                {/* Text Layers */}
                {state.textLayers.map((layer, index) => (
                  <div
                    key={layer.id}
                    className={`flex items-center justify-between p-2 rounded cursor-pointer transition-colors ${
                      state.selectedLayer === layer.id 
                        ? 'bg-red-500/20 border border-red-500/50' 
                        : 'bg-muted/30 hover:bg-muted/50'
                    }`}
                    onClick={() => dispatch({ type: 'SELECT_LAYER', payload: layer.id })}
                  >
                    <div className="flex items-center space-x-2 flex-1">
                      <Type className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm truncate">
                        {layer.content.substring(0, 15)}
                        {layer.content.length > 15 ? '...' : ''}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          duplicateLayer(layer);
                        }}
                        className="h-6 w-6 p-0"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteLayer(layer.id);
                        }}
                        className="h-6 w-6 p-0 text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}

                {state.textLayers.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Type className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No text layers yet</p>
                    <p className="text-xs">Click "Add Text" to start</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Text Editing Panel */}
          <TabsContent value="text" className="space-y-3">
            {selectedLayer ? (
              <>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Text Content</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label htmlFor="text-content" className="text-xs">Content</Label>
                      <Input
                        id="text-content"
                        value={selectedLayer.content}
                        onChange={(e) => updateSelectedLayer({ content: e.target.value })}
                        placeholder="Enter text..."
                        className="mt-1"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Typography</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-xs">Font Family</Label>
                      <Select
                        value={selectedLayer.style.fontFamily}
                        onValueChange={(value) => updateLayerStyle({ fontFamily: value })}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {state.fonts.map(font => (
                            <SelectItem key={font.name} value={font.name}>
                              <span style={{ fontFamily: font.name }}>{font.name}</span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-xs">Font Size: {selectedLayer.style.fontSize}px</Label>
                      <Slider
                        value={[selectedLayer.style.fontSize]}
                        onValueChange={([value]) => updateLayerStyle({ fontSize: value })}
                        max={120}
                        min={12}
                        step={1}
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label className="text-xs">Font Weight</Label>
                      <Select
                        value={selectedLayer.style.fontWeight}
                        onValueChange={(value) => updateLayerStyle({ fontWeight: value })}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="300">Light (300)</SelectItem>
                          <SelectItem value="400">Regular (400)</SelectItem>
                          <SelectItem value="600">Semi Bold (600)</SelectItem>
                          <SelectItem value="700">Bold (700)</SelectItem>
                          <SelectItem value="800">Extra Bold (800)</SelectItem>
                          <SelectItem value="900">Black (900)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="text-color" className="text-xs">Text Color</Label>
                      <div className="flex items-center space-x-2 mt-1">
                        <Input
                          id="text-color"
                          type="color"
                          value={selectedLayer.style.color}
                          onChange={(e) => updateLayerStyle({ color: e.target.value })}
                          className="w-12 h-8 p-1 border rounded"
                        />
                        <Input
                          value={selectedLayer.style.color}
                          onChange={(e) => updateLayerStyle({ color: e.target.value })}
                          placeholder="#ffffff"
                          className="flex-1 text-xs"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <Type className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                  <p className="text-sm text-muted-foreground">Select a text layer to edit</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Effects Panel */}
          <TabsContent value="effects" className="space-y-3">
            {selectedLayer ? (
              <>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Quick Presets</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-2">
                      {state.presets.textEffects.map(preset => (
                        <Button
                          key={preset.id}
                          variant="outline"
                          size="sm"
                          onClick={() => applyPreset(preset)}
                          className="text-xs hover:scale-105 transition-transform"
                        >
                          {preset.name}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Text Effects</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-xs">Shadow Color</Label>
                      <div className="flex items-center space-x-2 mt-1">
                        <Input
                          type="color"
                          value="#000000"
                          className="w-12 h-8 p-1 border rounded"
                        />
                        <Input
                          value="#000000"
                          placeholder="#000000"
                          className="flex-1 text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-xs">Shadow Blur: 4px</Label>
                      <Slider
                        defaultValue={[4]}
                        max={20}
                        min={0}
                        step={1}
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label className="text-xs">Stroke Width: 0px</Label>
                      <Slider
                        defaultValue={[0]}
                        max={10}
                        min={0}
                        step={1}
                        className="mt-2"
                      />
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <Palette className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                  <p className="text-sm text-muted-foreground">Select a text layer to apply effects</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Canvas Settings Panel */}
          <TabsContent value="settings" className="space-y-3">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Canvas Properties</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-xs">Background Color</Label>
                  <div className="flex items-center space-x-2 mt-1">
                    <Input
                      type="color"
                      value={state.canvas.backgroundColor}
                      onChange={(e) => dispatch({
                        type: 'SET_CANVAS_BACKGROUND',
                        payload: e.target.value
                      })}
                      className="w-12 h-8 p-1 border rounded"
                    />
                    <Input
                      value={state.canvas.backgroundColor}
                      onChange={(e) => dispatch({
                        type: 'SET_CANVAS_BACKGROUND',
                        payload: e.target.value
                      })}
                      placeholder="#1a1a1a"
                      className="flex-1 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-xs">Dimensions</Label>
                  <div className="flex items-center space-x-2 mt-1">
                    <Input value="1280" readOnly className="text-xs" />
                    <span className="text-xs text-muted-foreground">×</span>
                    <Input value="720" readOnly className="text-xs" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">YouTube Standard (16:9)</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default Sidebar;