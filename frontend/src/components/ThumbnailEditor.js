import React, { useState } from 'react';
import Canvas from './Canvas/Canvas';
import Sidebar from './Sidebar/Sidebar';
import Toolbar from './Toolbar/Toolbar';
import TemplateGallery from './Templates/TemplateGallery';
import { Button } from './ui/button';
import { useTheme } from '../contexts/ThemeContext';
import { useThumbnail } from '../contexts/ThumbnailContext';
import { Moon, Sun, Download, Undo, Redo } from 'lucide-react';

const ThumbnailEditor = () => {
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
    <div className={`min-h-screen bg-background transition-colors duration-300 ${theme}`}>
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
              YouTube Thumbnail Creator
            </h1>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleUndo}
                className="hover:scale-105 transition-transform"
              >
                <Undo className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRedo}
                className="hover:scale-105 transition-transform"
              >
                <Redo className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => setShowTemplates(true)}
              className="hover:scale-105 transition-transform"
            >
              Templates
            </Button>
            <Button
              onClick={handleExport}
              className="bg-red-600 hover:bg-red-700 hover:scale-105 transition-all"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
              className="hover:scale-105 transition-transform"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-80px)]">
        {/* Sidebar */}
        <div className="w-80 border-r border-border bg-card/30 backdrop-blur-sm">
          <Sidebar />
        </div>

        {/* Canvas Area */}
        <div className="flex-1 flex flex-col">
          <Toolbar />
          <div className="flex-1 p-6 overflow-auto">
            <Canvas />
          </div>
        </div>
      </div>

      {/* Template Gallery Modal */}
      {showTemplates && (
        <TemplateGallery onClose={() => setShowTemplates(false)} />
      )}
    </div>
  );
};

export default ThumbnailEditor;