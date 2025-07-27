export const mockData = {
  templates: [
    {
      id: '1',
      name: 'Gaming Highlight',
      category: 'gaming',
      backgroundColor: '#0f0f23',
      thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=300&h=200&fit=crop',
      layers: [
        {
          id: '1',
          type: 'text',
          content: 'EPIC WIN!',
          position: { x: 50, y: 100 },
          style: {
            fontSize: 72,
            fontFamily: 'Inter',
            color: '#00ff41',
            fontWeight: '900',
            textShadow: '0 0 20px rgba(0,255,65,0.5)',
            stroke: '#000000',
            strokeWidth: 3
          }
        }
      ]
    },
    {
      id: '2',
      name: 'Tech Review',
      category: 'tech',
      backgroundColor: '#1a1a2e',
      thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=200&fit=crop',
      layers: [
        {
          id: '2',
          type: 'text',
          content: 'REVIEW',
          position: { x: 100, y: 150 },
          style: {
            fontSize: 64,
            fontFamily: 'Inter',
            color: '#ffffff',
            fontWeight: '800',
            textShadow: '2px 2px 8px rgba(0,0,0,0.8)'
          }
        }
      ]
    },
    {
      id: '3',
      name: 'Tutorial Style',
      category: 'tutorial',
      backgroundColor: '#2d3748',
      thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=200&fit=crop',
      layers: [
        {
          id: '3',
          type: 'text',
          content: 'HOW TO',
          position: { x: 80, y: 120 },
          style: {
            fontSize: 56,
            fontFamily: 'Inter',
            color: '#ffd700',
            fontWeight: '700',
            textShadow: '1px 1px 4px rgba(0,0,0,0.6)'
          }
        }
      ]
    },
    {
      id: '4',
      name: 'Vlog Style',
      category: 'vlog',
      backgroundColor: '#ff6b6b',
      thumbnail: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=300&h=200&fit=crop',
      layers: [
        {
          id: '4',
          type: 'text',
          content: 'MY STORY',
          position: { x: 90, y: 140 },
          style: {
            fontSize: 60,
            fontFamily: 'Inter',
            color: '#ffffff',
            fontWeight: '600',
            textShadow: '2px 2px 6px rgba(0,0,0,0.4)'
          }
        }
      ]
    }
  ],
  
  fonts: [
    { name: 'Inter', category: 'sans-serif' },
    { name: 'Roboto', category: 'sans-serif' },
    { name: 'Poppins', category: 'sans-serif' },
    { name: 'Montserrat', category: 'sans-serif' },
    { name: 'Oswald', category: 'display' },
    { name: 'Bebas Neue', category: 'display' },
    { name: 'Anton', category: 'display' },
    { name: 'Playfair Display', category: 'serif' },
    { name: 'Merriweather', category: 'serif' }
  ],
  
  presets: {
    textEffects: [
      {
        id: 'glow',
        name: 'Glow Effect',
        style: {
          color: '#ffffff',
          textShadow: '0 0 20px currentColor, 0 0 40px currentColor',
          fontWeight: '700'
        }
      },
      {
        id: 'neon',
        name: 'Neon',
        style: {
          color: '#00ff41',
          textShadow: '0 0 5px currentColor, 0 0 10px currentColor, 0 0 15px currentColor',
          fontWeight: '600'
        }
      },
      {
        id: '3d',
        name: '3D Effect',
        style: {
          color: '#ffffff',
          textShadow: '1px 1px 0px #000, 2px 2px 0px #333, 3px 3px 0px #666',
          fontWeight: '800'
        }
      },
      {
        id: 'outline',
        name: 'Bold Outline',
        style: {
          color: '#ffffff',
          stroke: '#000000',
          strokeWidth: 4,
          fontWeight: '700'
        }
      }
    ],
    
    colorSchemes: [
      {
        id: 'gaming',
        name: 'Gaming',
        colors: ['#00ff41', '#ff0080', '#00d4ff', '#ffff00']
      },
      {
        id: 'tech',
        name: 'Tech',
        colors: ['#0066cc', '#ffffff', '#cccccc', '#ff6600']
      },
      {
        id: 'lifestyle',
        name: 'Lifestyle',
        colors: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24']
      },
      {
        id: 'education',
        name: 'Education',
        colors: ['#6c5ce7', '#a29bfe', '#fd79a8', '#fdcb6e']
      }
    ]
  }
};