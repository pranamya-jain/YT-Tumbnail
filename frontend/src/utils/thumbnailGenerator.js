// Smart thumbnail generation utilities

export const analyzeTitle = (title) => {
  const analysis = {
    wordCount: title.split(' ').length,
    hasQuestion: title.includes('?'),
    hasExclamation: title.includes('!'),
    hasNumbers: /\d/.test(title),
    keyWords: extractKeywords(title),
    sentiment: analyzeSentiment(title),
    category: detectCategory(title),
    length: title.length
  };

  return analysis;
};

const extractKeywords = (title) => {
  const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those'];
  const words = title.toLowerCase().split(' ');
  return words.filter(word => !stopWords.includes(word) && word.length > 2);
};

const analyzeSentiment = (title) => {
  const positiveWords = ['amazing', 'awesome', 'great', 'best', 'perfect', 'excellent', 'fantastic', 'incredible', 'ultimate', 'pro', 'master', 'epic', 'insane', 'crazy', 'mind-blowing'];
  const negativeWords = ['worst', 'terrible', 'awful', 'bad', 'horrible', 'disaster', 'fail', 'wrong', 'mistake', 'problem'];
  
  const lowerTitle = title.toLowerCase();
  const positiveCount = positiveWords.filter(word => lowerTitle.includes(word)).length;
  const negativeCount = negativeWords.filter(word => lowerTitle.includes(word)).length;
  
  if (positiveCount > negativeCount) return 'positive';
  if (negativeCount > positiveCount) return 'negative';
  return 'neutral';
};

const detectCategory = (title) => {
  const categoryKeywords = {
    gaming: ['game', 'gaming', 'play', 'player', 'gameplay', 'review', 'fps', 'rpg', 'strategy', 'indie', 'steam', 'pc', 'console', 'xbox', 'playstation', 'nintendo'],
    tech: ['tech', 'technology', 'computer', 'software', 'hardware', 'app', 'phone', 'iphone', 'android', 'review', 'unboxing', 'comparison', 'vs', 'specs', 'performance'],
    tutorial: ['how', 'tutorial', 'guide', 'learn', 'course', 'lesson', 'step', 'easy', 'beginner', 'advanced', 'tips', 'tricks', 'hacks', 'diy'],
    vlog: ['vlog', 'day', 'life', 'daily', 'routine', 'travel', 'food', 'lifestyle', 'personal', 'story', 'experience', 'journey'],
    news: ['news', 'breaking', 'update', 'latest', 'report', 'analysis', 'politics', 'world', 'economy', 'business', 'market']
  };
  
  const lowerTitle = title.toLowerCase();
  let maxScore = 0;
  let detectedCategory = 'tech'; // default
  
  Object.entries(categoryKeywords).forEach(([category, keywords]) => {
    const score = keywords.filter(keyword => lowerTitle.includes(keyword)).length;
    if (score > maxScore) {
      maxScore = score;
      detectedCategory = category;
    }
  });
  
  return detectedCategory;
};

export const calculateOptimalFontSize = (text, sizeCategory, analysis) => {
  const baseSize = {
    small: 32,
    medium: 48,
    large: 64,
    xlarge: 80
  };

  let fontSize = baseSize[sizeCategory] || baseSize.medium;

  // Adjust based on text length
  if (analysis.length > 50) fontSize *= 0.7;
  else if (analysis.length > 30) fontSize *= 0.85;
  else if (analysis.length < 15) fontSize *= 1.3;

  // Adjust based on word count
  if (analysis.wordCount > 8) fontSize *= 0.8;
  else if (analysis.wordCount < 4) fontSize *= 1.2;

  // Boost size for questions and exclamations
  if (analysis.hasQuestion || analysis.hasExclamation) fontSize *= 1.1;

  return Math.max(24, Math.min(fontSize, 120));
};

export const getStyleCustomizations = (style) => {
  const styleConfig = {
    gaming: {
      colors: ['#00ff41', '#ff0080', '#00d4ff', '#ffff00', '#ff6b6b'],
      fonts: ['Oswald', 'Bebas Neue', 'Inter'],
      effects: ['neon-glow', 'electric-border', 'pixel-shadow'],
      overlays: ['gaming-gradient', 'tech-grid']
    },
    tech: {
      colors: ['#667eea', '#764ba2', '#4facfe', '#00f2fe', '#667eea'],
      fonts: ['Inter', 'Roboto', 'Montserrat'],
      effects: ['glass-morphism', 'subtle-glow', 'clean-shadow'],
      overlays: ['tech-gradient', 'minimal-overlay']
    },
    tutorial: {
      colors: ['#FFA726', '#42A5F5', '#66BB6A', '#EF5350', '#AB47BC'],
      fonts: ['Montserrat', 'Poppins', 'Inter'],
      effects: ['friendly-shadow', 'warm-glow', 'soft-border'],
      overlays: ['education-gradient', 'learning-pattern']
    },
    vlog: {
      colors: ['#FF8A80', '#FFD54F', '#A7FFEB', '#B39DDB', '#FFCC02'],
      fonts: ['Poppins', 'Inter', 'Quicksand'],
      effects: ['casual-shadow', 'lifestyle-glow', 'personal-border'],
      overlays: ['vlog-gradient', 'personal-overlay']
    },
    news: {
      colors: ['#D32F2F', '#1976D2', '#388E3C', '#F57C00', '#7B1FA2'],
      fonts: ['Inter', 'Roboto', 'Montserrat'],
      effects: ['professional-shadow', 'news-border', 'authority-glow'],
      overlays: ['news-gradient', 'breaking-overlay']
    }
  };

  return styleConfig[style] || styleConfig.tech;
};

export const generateThumbnailVariations = async (title, backgroundImage, style) => {
  const analysis = analyzeTitle(title);
  const styleConfig = getStyleCustomizations(style);
  const variations = [];

  // Template 1: Bold Center Layout
  variations.push({
    id: 'bold-center',
    name: 'Bold Center',
    title,
    backgroundImage,
    layout: {
      textPosition: 'center',
      textAlign: 'center',
      backgroundOverlay: 'dark-gradient'
    },
    textStyle: {
      fontSize: calculateOptimalFontSize(title, 'large', analysis),
      fontWeight: '900',
      fontFamily: styleConfig.fonts[0],
      color: styleConfig.colors[0],
      stroke: '#000000',
      strokeWidth: 3,
      textShadow: '0 0 20px rgba(0,0,0,0.8)'
    },
    overlay: {
      type: 'gradient',
      stops: [
        { position: 0, color: 'rgba(0,0,0,0.7)' },
        { position: 0.5, color: 'rgba(0,0,0,0.3)' },
        { position: 1, color: 'rgba(0,0,0,0.7)' }
      ]
    }
  });

  // Template 2: Top Banner Style
  variations.push({
    id: 'top-banner',
    name: 'Top Banner',
    title,
    backgroundImage,
    layout: {
      textPosition: 'top',
      textAlign: 'center',
      backgroundOverlay: 'top-gradient'
    },
    textStyle: {
      fontSize: calculateOptimalFontSize(title, 'medium', analysis),
      fontWeight: '800',
      fontFamily: styleConfig.fonts[1],
      color: '#ffffff',
      textShadow: '2px 2px 8px rgba(0,0,0,0.8)'
    },
    overlay: {
      type: 'gradient',
      stops: [
        { position: 0, color: 'rgba(0,0,0,0.8)' },
        { position: 0.6, color: 'rgba(0,0,0,0.2)' },
        { position: 1, color: 'rgba(0,0,0,0)' }
      ]
    }
  });

  // Template 3: Side Split Layout
  variations.push({
    id: 'side-split',
    name: 'Side Split',
    title,
    backgroundImage,
    layout: {
      textPosition: 'left',
      textAlign: 'left',
      imagePosition: 'right',
      backgroundOverlay: 'left-gradient'
    },
    textStyle: {
      fontSize: calculateOptimalFontSize(title, 'large', analysis),
      fontWeight: '700',
      fontFamily: styleConfig.fonts[0],
      color: styleConfig.colors[1],
      stroke: '#ffffff',
      strokeWidth: 2,
      textShadow: '2px 2px 6px rgba(0,0,0,0.6)'
    },
    overlay: {
      type: 'gradient',
      stops: [
        { position: 0, color: 'rgba(0,0,0,0.9)' },
        { position: 0.5, color: 'rgba(0,0,0,0.3)' },
        { position: 1, color: 'rgba(0,0,0,0)' }
      ]
    }
  });

  // Template 4: Bottom Overlay
  variations.push({
    id: 'bottom-overlay',
    name: 'Bottom Overlay',
    title,
    backgroundImage,
    layout: {
      textPosition: 'bottom',
      textAlign: 'center',
      backgroundOverlay: 'bottom-gradient'
    },
    textStyle: {
      fontSize: calculateOptimalFontSize(title, 'medium', analysis),
      fontWeight: '800',
      fontFamily: styleConfig.fonts[1],
      color: '#ffffff',
      textShadow: '2px 2px 8px rgba(0,0,0,0.8)'
    },
    overlay: {
      type: 'gradient',
      stops: [
        { position: 0, color: 'rgba(0,0,0,0)' },
        { position: 0.4, color: 'rgba(0,0,0,0.2)' },
        { position: 1, color: 'rgba(0,0,0,0.8)' }
      ]
    }
  });

  // Template 5: Corner Emphasis
  variations.push({
    id: 'corner-emphasis',
    name: 'Corner Power',
    title,
    backgroundImage,
    layout: {
      textPosition: 'top-left',
      textAlign: 'left',
      backgroundOverlay: 'corner-gradient'
    },
    textStyle: {
      fontSize: calculateOptimalFontSize(title, 'large', analysis),
      fontWeight: '900',
      fontFamily: styleConfig.fonts[0],
      color: styleConfig.colors[2],
      stroke: '#000000',
      strokeWidth: 3,
      textShadow: '0 0 15px rgba(0,0,0,0.7)'
    },
    overlay: {
      type: 'gradient',
      stops: [
        { position: 0, color: 'rgba(0,0,0,0.8)' },
        { position: 0.7, color: 'rgba(0,0,0,0.2)' },
        { position: 1, color: 'rgba(0,0,0,0)' }
      ]
    }
  });

  // Template 6: Dynamic Style-Based Template
  const dynamicTemplate = createDynamicTemplate(title, backgroundImage, style, analysis, styleConfig);
  variations.push(dynamicTemplate);

  return variations;
};

const createDynamicTemplate = (title, backgroundImage, style, analysis, styleConfig) => {
  // Create a template based on content analysis
  let layout = { textPosition: 'center', textAlign: 'center' };
  let textStyle = {
    fontSize: calculateOptimalFontSize(title, 'large', analysis),
    fontWeight: '800',
    fontFamily: styleConfig.fonts[0],
    color: styleConfig.colors[0]
  };

  // Adjust based on sentiment
  if (analysis.sentiment === 'positive') {
    textStyle.color = styleConfig.colors[3]; // Brighter color
    textStyle.fontSize *= 1.1;
  } else if (analysis.sentiment === 'negative') {
    textStyle.color = '#ff4757'; // Red for negative
    layout.textPosition = 'top';
  }

  // Adjust based on question/exclamation
  if (analysis.hasQuestion) {
    layout.textPosition = 'bottom';
    textStyle.fontWeight = '700';
  } else if (analysis.hasExclamation) {
    textStyle.fontSize *= 1.2;
    textStyle.color = styleConfig.colors[4];
  }

  return {
    id: 'ai-optimized',
    name: 'AI Optimized',
    title,
    backgroundImage,
    layout,
    textStyle: {
      ...textStyle,
      stroke: '#000000',
      strokeWidth: 2,
      textShadow: '2px 2px 8px rgba(0,0,0,0.7)'
    },
    overlay: {
      type: 'gradient',
      stops: [
        { position: 0, color: 'rgba(0,0,0,0.6)' },
        { position: 0.5, color: 'rgba(0,0,0,0.2)' },
        { position: 1, color: 'rgba(0,0,0,0.6)' }
      ]
    }
  };
};