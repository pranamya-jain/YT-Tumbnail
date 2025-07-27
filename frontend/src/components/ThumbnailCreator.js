import React, { useState } from 'react';
import AutoGenerateMode from './AutoGenerate/AutoGenerateMode';
import ManualEditMode from './ManualEdit/ManualEditMode';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Wand2, Edit3, Sparkles, Palette } from 'lucide-react';
import { useThumbnail } from '../contexts/ThumbnailContext';

const ThumbnailCreator = () => {
  const [activeMode, setActiveMode] = useState('auto');
  const { dispatch } = useThumbnail();

  const switchToManualEdit = (variation) => {
    // Convert auto-generated template to manual editing format
    const manualElements = convertVariationToManualElements(variation);
    
    // Set background image
    if (variation.backgroundImage) {
      dispatch({
        type: 'SET_BACKGROUND_IMAGE',
        payload: variation.backgroundImage
      });
    }

    // Add text elements
    if (variation.textElements) {
      variation.textElements.forEach(textElement => {
        dispatch({
          type: 'ADD_TEXT_LAYER',
          payload: {
            content: textElement.content,
            position: textElement.position,
            style: textElement.style
          }
        });
      });
    }

    setActiveMode('manual');
  };

  const convertVariationToManualElements = (variation) => {
    return {
      backgroundImage: variation.backgroundImage,
      textElements: variation.textLayers || [],
      overlays: variation.overlays || []
    };
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Mode Toggle */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
              YouTube Thumbnail Creator
            </h1>
            <div className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-yellow-500" />
              <span className="text-sm text-muted-foreground">AI-Powered</span>
            </div>
          </div>
        </div>

        {/* Mode Toggle Tabs */}
        <div className="px-6 pb-4">
          <Tabs value={activeMode} onValueChange={setActiveMode} className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2 bg-muted/30">
              <TabsTrigger 
                value="auto" 
                className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-blue-500 data-[state=active]:text-white"
              >
                <Wand2 className="h-4 w-4" />
                <span>Auto Generate</span>
              </TabsTrigger>
              <TabsTrigger 
                value="manual"
                className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-red-600 data-[state=active]:text-white"
              >
                <Edit3 className="h-4 w-4" />
                <span>Manual Edit</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </header>

      {/* Mode Content */}
      <div className="flex-1">
        {activeMode === 'auto' ? (
          <AutoGenerateMode onSwitchToManual={switchToManualEdit} />
        ) : (
          <ManualEditMode />
        )}
      </div>
    </div>
  );
};

export default ThumbnailCreator;