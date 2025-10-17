# Gemini AI Optimization Updates

## Summary of Changes

This update includes three major improvements to your PDF AI Viewer:

### 1. **Optimized Gemini Prompt** ✨
The prompt has been completely rewritten to be more educational and structured:
- Clear role definition as an expert educational assistant
- Detailed context information about slides
- Structured response guidelines with 7 key points
- Better formatting instructions for markdown responses
- Focus on student learning and comprehension

### 2. **Multi-Slide Context Support** 🖼️
The AI now has access to multiple slides for better context:
- **Slide Caching**: All rendered slides are cached in memory
- **Context Images**: Previous slides (configurable: 0-4) are sent to Gemini
- **Smart Context**: The last image is always the current slide being analyzed
- **Better Understanding**: AI can reference previous content for continuity

### 3. **Model Selection** 🎯
Users can now choose between three Gemini models:
- **Gemini 2.0 Flash** (Default) - Latest experimental model, fast and efficient
- **Gemini 1.5 Flash** - Fast responses with good quality
- **Gemini 1.5 Pro** - Best quality, slower responses

## New Features

### Settings Panel
- Toggle with Settings button in the header
- Model selector with descriptions
- Context slide count selector (0-4 previous slides)
- Settings persist using localStorage

### Technical Improvements
- **Slide Image Caching**: Map-based cache for rendered slides
- **Context Management**: Intelligently includes previous slides
- **Model Switching**: Dynamic API endpoint based on selected model
- **Better Error Handling**: Improved error messages
- **Chat History Limiting**: Only last 10 messages sent to API (reduces tokens)

## Files Modified

1. **src/services/gemini.ts**
   - Added GEMINI_MODELS constant with model definitions
   - Updated sendToGemini() to accept model and contextImages parameters
   - Completely rewrote the system prompt
   - Added support for multiple context images
   - Dynamic API URL based on model selection

2. **src/pages/ViewerPage.tsx**
   - Added model selection state with localStorage persistence
   - Added slide image caching with Map<number, string>
   - Added settings panel toggle
   - Updated message handlers to include context slides
   - Added handlePageRender callback for caching

3. **src/types/index.ts**
   - Added GeminiModel type
   - Added ModelConfig interface

## Files Created

1. **src/components/app/ModelSelector.tsx**
   - New component for model selection
   - Card-based UI with descriptions
   - Visual feedback for selected model

2. **src/hooks/useLocalStorage.ts**
   - Custom hook for persisting state to localStorage
   - Type-safe with generics
   - Auto-reads on mount

## Usage

### For Users
1. Click the **Settings** button in the viewer
2. Choose your preferred AI model
3. Select how many previous slides to include (0-4)
4. Settings are saved automatically

### Context Slides Explanation
- **0**: Only current slide (fastest, least context)
- **1**: Current + 1 previous slide
- **2**: Current + 2 previous slides (recommended)
- **3**: Current + 3 previous slides
- **4**: Current + 4 previous slides (slowest, most context)

## Benefits

### Better AI Responses
- More educational and structured explanations
- References to previous slides when relevant
- Better understanding of multi-slide concepts

### Performance Options
- Choose speed vs. quality trade-off
- Control context to manage API costs
- Cache slides to avoid re-rendering

### User Experience
- Persistent settings across sessions
- Visual model selection
- Clear context configuration

## API Cost Considerations

More context slides = more images sent to Gemini = higher API costs
- Each image in context counts toward your API usage
- Recommended: Start with 2 context slides
- Adjust based on your needs and budget

## Future Enhancements (Suggestions)

1. Add slide thumbnails view
2. Export chat history
3. Add more models (e.g., Claude, GPT-4)
4. Batch slide analysis
5. Custom prompt templates
6. Usage statistics and costs tracking
