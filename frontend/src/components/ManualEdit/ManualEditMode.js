import React from 'react';
import Canvas from '../Canvas/Canvas';
import Sidebar from '../Sidebar/Sidebar';
import Toolbar from '../Toolbar/Toolbar';
import TemplateGallery from '../Templates/TemplateGallery';
import { useState } from 'react';
import { Button } from '../ui/button';
import { useTheme } from '../../contexts/ThemeContext';
import { useThumbnail } from '../../contexts/ThumbnailContext';
import { Moon, Sun, Download, Undo, Redo, Palette } from 'lucide-react';

const ManualEditMode = () => {
  const [showTemplates, setShowTemplates] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { state, dispatch } = useThumbnail();

  const handleExport = () => {
    // Mock export functionality
    const canvas = document.getElementById('thumbnail-canvas');
    if (canvas) {
      // Create a temporary link for download
      const link = document.createElement('a');
      link.download = 'youtube-thumbnail.png';
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  const handleUndo = () => {
    // Mock undo functionality
    console.log('Undo action');
  };

  const handleRedo = () => {
    // Mock redo functionality
    console.log('Redo action');
  };

  return (
    <div className="h-[calc(100vh-140px)]">
      {/* Toolbar */}
      <div className="border-b border-border">
        <Toolbar />
      </div>

      {/* Main Content */}
      <div className="flex h-[calc(100%-60px)]">
        {/* Sidebar */}
        <div className="w-80 border-r border-border bg-card/30 backdrop-blur-sm">
          <Sidebar />
        </div>

        {/* Canvas Area */}
        <div className="flex-1 p-6 overflow-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold">Manual Editor</h2>
              <p className="text-sm text-muted-foreground">
                Drag, drop, and customize every element
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowTemplates(true)}
                className="hover:scale-105 transition-transform"
              >
                <Palette className="h-4 w-4 mr-2" />
                Templates
              </Button>
              <Button
                onClick={handleExport}
                className="bg-red-600 hover:bg-red-700 hover:scale-105 transition-all"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
          
          <Canvas />
        </div>
      </div>

      {/* Template Gallery Modal */}
      {showTemplates && (
        <TemplateGallery onClose={() => setShowTemplates(false)} />
      )}
    </div>
  );
};

export default ManualEditMode;