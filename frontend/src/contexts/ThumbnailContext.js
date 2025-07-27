import React, { createContext, useContext, useReducer } from 'react';
import { mockData } from '../data/mockData';

const ThumbnailContext = createContext();

const initialState = {
  canvas: {
    width: 1280,
    height: 720,
    backgroundColor: '#1a1a1a'
  },
  backgroundImage: null,
  textLayers: [],
  selectedLayer: null,
  history: [],
  historyIndex: -1,
  templates: mockData.templates,
  fonts: mockData.fonts,
  presets: mockData.presets
};

const thumbnailReducer = (state, action) => {
  switch (action.type) {
    case 'SET_BACKGROUND_IMAGE':
      return {
        ...state,
        backgroundImage: action.payload,
        history: [...state.history.slice(0, state.historyIndex + 1), { ...state, backgroundImage: action.payload }],
        historyIndex: state.historyIndex + 1
      };
    
    case 'ADD_TEXT_LAYER':
      const newLayer = {
        id: Date.now().toString(),
        type: 'text',
        content: action.payload.content || 'Double-click to edit',
        position: action.payload.position || { x: 100, y: 100 },
        style: {
          fontSize: 48,
          fontFamily: 'Inter',
          color: '#ffffff',
          fontWeight: 'bold',
          textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
          ...action.payload.style
        }
      };
      return {
        ...state,
        textLayers: [...state.textLayers, newLayer],
        selectedLayer: newLayer.id
      };
    
    case 'UPDATE_TEXT_LAYER':
      return {
        ...state,
        textLayers: state.textLayers.map(layer => 
          layer.id === action.payload.id 
            ? { ...layer, ...action.payload.updates }
            : layer
        )
      };
    
    case 'DELETE_TEXT_LAYER':
      return {
        ...state,
        textLayers: state.textLayers.filter(layer => layer.id !== action.payload),
        selectedLayer: state.selectedLayer === action.payload ? null : state.selectedLayer
      };
    
    case 'SELECT_LAYER':
      return {
        ...state,
        selectedLayer: action.payload
      };
    
    case 'SET_CANVAS_BACKGROUND':
      return {
        ...state,
        canvas: { ...state.canvas, backgroundColor: action.payload }
      };
    
    case 'APPLY_TEMPLATE':
      const template = state.templates.find(t => t.id === action.payload);
      if (template) {
        return {
          ...state,
          textLayers: template.layers || [],
          canvas: { ...state.canvas, backgroundColor: template.backgroundColor || state.canvas.backgroundColor }
        };
      }
      return state;
    
    default:
      return state;
  }
};

export const ThumbnailProvider = ({ children }) => {
  const [state, dispatch] = useReducer(thumbnailReducer, initialState);

  return (
    <ThumbnailContext.Provider value={{ state, dispatch }}>
      {children}
    </ThumbnailContext.Provider>
  );
};

export const useThumbnail = () => {
  const context = useContext(ThumbnailContext);
  if (!context) {
    throw new Error('useThumbnail must be used within a ThumbnailProvider');
  }
  return context;
};