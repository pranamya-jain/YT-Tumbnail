import React, { useState } from 'react';
import AutoGeneratePanel from './AutoGeneratePanel';
import ThumbnailVariationsDisplay from './ThumbnailVariationsDisplay';
import { generateThumbnailVariations } from '../../utils/thumbnailGenerator';
import { Card, CardContent } from '../ui/card';
import { Loader2, Sparkles } from 'lucide-react';

const AutoGenerateMode = ({ onSwitchToManual }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVariations, setGeneratedVariations] = useState([]);
  const [generationInputs, setGenerationInputs] = useState(null);

  const handleGenerate = async (inputs) => {
    setIsGenerating(true);
    setGenerationInputs(inputs);
    
    try {
      // Simulate generation delay for better UX
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const variations = await generateThumbnailVariations(
        inputs.title,
        inputs.backgroundImage,
        inputs.style
      );
      
      setGeneratedVariations(variations);
    } catch (error) {
      console.error('Generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerateWithDifferentStyle = (newStyle) => {
    if (generationInputs) {
      handleGenerate({
        ...generationInputs,
        style: newStyle
      });
    }
  };

  return (
    <div className="flex h-[calc(100vh-140px)]">
      {/* Left Panel - Auto Generate Controls */}
      <div className="w-96 border-r border-border bg-card/30 backdrop-blur-sm p-6 overflow-y-auto">
        <div className="space-y-6">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Sparkles className="h-6 w-6 text-purple-500" />
              <h2 className="text-xl font-bold">AI Thumbnail Generator</h2>
            </div>
            <p className="text-sm text-muted-foreground">
              Generate professional thumbnails instantly with AI-powered design
            </p>
          </div>

          <AutoGeneratePanel 
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
          />

          {/* Quick Style Regeneration */}
          {generatedVariations.length > 0 && !isGenerating && (
            <Card>
              <CardContent className="p-4">
                <h3 className="text-sm font-semibold mb-3">Try Different Styles</h3>
                <div className="grid grid-cols-2 gap-2">
                  {['gaming', 'tech', 'tutorial', 'vlog', 'news'].map(style => (
                    <button
                      key={style}
                      onClick={() => handleRegenerateWithDifferentStyle(style)}
                      className="px-3 py-2 text-xs bg-muted hover:bg-muted/80 rounded-md capitalize transition-colors"
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Right Panel - Generated Variations or Loading */}
      <div className="flex-1 p-6 overflow-y-auto">
        {isGenerating ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="text-center space-y-6">
              <div className="relative">
                <Loader2 className="h-16 w-16 text-purple-500 animate-spin mx-auto" />
                <Sparkles className="h-8 w-8 text-yellow-500 absolute -top-2 -right-2 animate-pulse" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Generating Your Thumbnails</h3>
                <p className="text-muted-foreground">
                  Our AI is analyzing your content and creating professional thumbnail variations...
                </p>
              </div>
              <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                  <span>Analyzing text</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span>Optimizing layout</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Applying styles</span>
                </div>
              </div>
            </div>
          </div>
        ) : generatedVariations.length > 0 ? (
          <ThumbnailVariationsDisplay
            variations={generatedVariations}
            onSwitchToManual={onSwitchToManual}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="text-center space-y-4 opacity-60">
              <Wand2 className="h-24 w-24 mx-auto text-muted-foreground" />
              <h3 className="text-xl font-semibold">Ready to Generate</h3>
              <p className="text-muted-foreground max-w-md">
                Enter your video title and upload a background image to generate professional thumbnail variations instantly.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AutoGenerateMode;