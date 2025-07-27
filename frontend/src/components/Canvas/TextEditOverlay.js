import React, { useState, useRef, useEffect } from 'react';

const TextEditOverlay = ({ layer, position, onSave, onCancel, canvasScale }) => {
  const [text, setText] = useState(layer.content);
  const inputRef = useRef(null);

  useEffect(() => {
    // Focus and select all text when component mounts
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, []);

  const handleKeyDown = (e) => {
    switch (e.key) {
      case 'Enter':
        if (!e.shiftKey) {
          e.preventDefault();
          handleSave();
        }
        break;
      case 'Escape':
        e.preventDefault();
        handleCancel();
        break;
      default:
        break;
    }
  };

  const handleSave = () => {
    onSave(text || 'Text');
  };

  const handleCancel = () => {
    onCancel();
  };

  const handleBlur = () => {
    // Save on blur (clicking outside)
    handleSave();
  };

  // Calculate the scale factor based on canvas display size vs actual size
  const scaleX = canvasScale.width / 1280; // Canvas actual width / display width
  const scaleY = canvasScale.height / 720;  // Canvas actual height / display height

  // Calculate input style based on layer properties
  const inputStyle = {
    position: 'absolute',
    left: `${position.x}px`,
    top: `${position.y}px`,
    fontSize: `${layer.style.fontSize * scaleY}px`,
    fontFamily: layer.style.fontFamily,
    fontWeight: layer.style.fontWeight,
    color: layer.style.color,
    background: 'transparent',
    border: '2px dashed #ef4444',
    borderRadius: '4px',
    outline: 'none',
    padding: '4px 8px',
    minWidth: '100px',
    maxWidth: '400px',
    zIndex: 1000,
    boxShadow: '0 0 0 2px rgba(239, 68, 68, 0.2)',
    transform: 'translateY(-25%)', // Adjust for better positioning
  };

  return (
    <input
      ref={inputRef}
      type="text"
      value={text}
      onChange={(e) => setText(e.target.value)}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
      style={inputStyle}
      placeholder="Enter text..."
      autoFocus
    />
  );
};

export default TextEditOverlay;