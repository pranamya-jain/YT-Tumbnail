import React, { useState, useRef } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Upload, Image, Type, Palette, Wand2, AlertCircle } from 'lucide-react';

const AutoGeneratePanel = ({ onGenerate, isGenerating }) => {
  const [title, setTitle] = useState('');
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [selectedStyle, setSelectedStyle] = useState('gaming');
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);

  const characterCount = title.length;
  const maxCharacters = 100;

  const styles = [
    { id: 'gaming', name: 'Gaming', color: 'from-green-500 to-blue-500', icon: '🎮' },
    { id: 'tech', name: 'Tech', color: 'from-blue-500 to-purple-500', icon: '💻' },
    { id: 'tutorial', name: 'Tutorial', color: 'from-orange-500 to-red-500', icon: '📚' },
    { id: 'vlog', name: 'Vlog', color: 'from-pink-500 to-purple-500', icon: '📹' },
    { id: 'news', name: 'News', color: 'from-red-500 to-orange-500', icon: '📰' },
  ];

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setBackgroundImage(e.target.result);
        setPreviewImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = () => {
    if (!title.trim()) {
      alert('Please enter a title for your thumbnail');
      return;
    }

    if (!backgroundImage) {
      alert('Please upload a background image');
      return;
    }

    onGenerate({
      title: title.trim(),
      backgroundImage,
      style: selectedStyle
    });
  };

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    if (newTitle.length <= maxCharacters) {
      setTitle(newTitle);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title Input */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-base">
            <Type className="h-4 w-4" />
            <span>Video Title</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Textarea
            placeholder="Enter your video title here... (e.g., 'How to Build AMAZING React Apps in 2024')"
            value={title}
            onChange={handleTitleChange}
            rows={3}
            className="resize-none"
          />
          <div className="flex items-center justify-between">
            <span className={`text-xs ${
              characterCount > maxCharacters * 0.8 
                ? 'text-red-500' 
                : characterCount > maxCharacters * 0.6 
                  ? 'text-yellow-500' 
                  : 'text-muted-foreground'
            }`}>
              {characterCount}/{maxCharacters} characters
            </span>
            {title && (
              <Badge variant="secondary" className="text-xs">
                {title.split(' ').length} words
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Image Upload */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-base">
            <Image className="h-4 w-4" />
            <span>Background Image</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div 
            className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center cursor-pointer hover:border-muted-foreground/50 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            
            {previewImage ? (
              <div className="space-y-3">
                <img
                  src={previewImage}
                  alt="Background preview"
                  className="w-full h-32 object-cover rounded-md"
                />
                <Button variant="outline" size="sm" className="text-xs">
                  <Upload className="h-3 w-3 mr-2" />
                  Change Image
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <Upload className="h-12 w-12 mx-auto text-muted-foreground/50" />
                <div>
                  <p className="text-sm font-medium">Click to upload image</p>
                  <p className="text-xs text-muted-foreground">
                    JPG, PNG, WebP up to 10MB
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Style Selection */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-base">
            <Palette className="h-4 w-4" />
            <span>Thumbnail Style</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-2">
            {styles.map((style) => (
              <button
                key={style.id}
                onClick={() => setSelectedStyle(style.id)}
                className={`p-3 rounded-lg border-2 transition-all text-left ${
                  selectedStyle === style.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-muted-foreground/50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-md bg-gradient-to-r ${style.color} flex items-center justify-center text-white text-sm`}>
                    {style.icon}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{style.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Perfect for {style.name.toLowerCase()} content
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Generate Button */}
      <Button
        onClick={handleGenerate}
        disabled={isGenerating || !title.trim() || !backgroundImage}
        className="w-full h-12 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 transition-all"
      >
        {isGenerating ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
            Generating...
          </>
        ) : (
          <>
            <Wand2 className="h-4 w-4 mr-2" />
            Generate Thumbnails
          </>
        )}
      </Button>

      {/* Tips */}
      <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
        <CardContent className="p-4">
          <div className="flex items-start space-x-2">
            <AlertCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-blue-700 dark:text-blue-300">
              <p className="font-medium mb-1">Pro Tips:</p>
              <ul className="space-y-1 text-xs">
                <li>• Keep titles under 60 characters for better readability</li>
                <li>• Use high-resolution images (1280x720 or higher)</li>
                <li>• Choose styles that match your content category</li>
                <li>• Questions and numbers in titles perform well</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AutoGeneratePanel;