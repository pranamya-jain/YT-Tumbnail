import React, { useState } from 'react';
import { useThumbnail } from '../../contexts/ThumbnailContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { X, Search, Play, Monitor, BookOpen, User, Music, Gamepad2 } from 'lucide-react';

const TemplateGallery = ({ onClose }) => {
  const { state, dispatch } = useThumbnail();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Templates', icon: null },
    { id: 'gaming', name: 'Gaming', icon: <Gamepad2 className="h-4 w-4" /> },
    { id: 'tech', name: 'Tech Review', icon: <Monitor className="h-4 w-4" /> },
    { id: 'tutorial', name: 'Tutorial', icon: <BookOpen className="h-4 w-4" /> },
    { id: 'vlog', name: 'Vlog', icon: <User className="h-4 w-4" /> },
    { id: 'music', name: 'Music', icon: <Music className="h-4 w-4" /> }
  ];

  const filteredTemplates = state.templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const applyTemplate = (template) => {
    dispatch({
      type: 'APPLY_TEMPLATE',
      payload: template.id
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-lg shadow-2xl w-full max-w-6xl h-[80vh] flex flex-col animate-in fade-in-0 zoom-in-95 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-2xl font-bold">Template Gallery</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Choose from professionally designed templates to get started quickly
            </p>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={onClose}
            className="hover:scale-105 transition-transform"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center space-x-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Category Tabs */}
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="grid grid-cols-6 w-full">
              {categories.map(category => (
                <TabsTrigger key={category.id} value={category.id} className="text-xs">
                  {category.icon && <span className="mr-1">{category.icon}</span>}
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Template Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map(template => (
              <Card
                key={template.id}
                className="group cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105"
                onClick={() => applyTemplate(template)}
              >
                <CardContent className="p-0">
                  {/* Template Preview */}
                  <div className="aspect-video relative overflow-hidden rounded-t-lg">
                    <img
                      src={template.thumbnail}
                      alt={template.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <Button className="bg-red-600 hover:bg-red-700">
                        <Play className="h-4 w-4 mr-2" />
                        Use Template
                      </Button>
                    </div>
                    <div className="absolute top-2 right-2">
                      <Badge
                        variant="secondary"
                        className="bg-black/50 text-white backdrop-blur-sm"
                      >
                        {template.category}
                      </Badge>
                    </div>
                  </div>

                  {/* Template Info */}
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-1">{template.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Perfect for {template.category} content
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">
                          {template.layers ? template.layers.length : 0} layers
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          1280×720
                        </Badge>
                      </div>
                      <Button
                        size="sm"
                        className="bg-red-600 hover:bg-red-700 hover:scale-105 transition-all"
                        onClick={(e) => {
                          e.stopPropagation();
                          applyTemplate(template);
                        }}
                      >
                        Apply
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredTemplates.length === 0 && (
            <div className="text-center py-12">
              <Search className="h-16 w-16 mx-auto text-muted-foreground opacity-50 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No templates found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search terms or category filter
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border bg-muted/20">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {filteredTemplates.length} templates available
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button className="bg-red-600 hover:bg-red-700" onClick={onClose}>
                Create Blank
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateGallery;