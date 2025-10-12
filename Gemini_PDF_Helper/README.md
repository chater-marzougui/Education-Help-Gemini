# PDF AI Viewer

A modern web-based PDF viewer with AI-powered slide analysis and explanation capabilities using Google's Gemini API.

Built with **Vite + React + TypeScript + Tailwind CSS + shadcn/ui**.

![API Key Setup](https://github.com/user-attachments/assets/5f8dfaf8-eea1-4493-96d6-512a27c3c11a)

## Features

- ✅ **Type-Safe**: Built with TypeScript for reliability and maintainability
- 🎨 **Modern UI**: Beautiful interface using Tailwind CSS and shadcn/ui components
- 📄 **PDF Viewing**: Open and navigate through PDF documents with intuitive controls
- 🤖 **AI Analysis**: Get instant explanations of slides using Gemini AI
- 💬 **Interactive Chat**: Ask questions about the PDF content and receive AI-powered responses
- 📱 **Responsive Design**: Works on desktop and mobile devices
- ⌨️ **Keyboard Shortcuts**: Navigate efficiently with keyboard controls
- 🎯 **User-Friendly Controls**: Zoom, pan, navigate, and interact with PDF pages easily
- 🔒 **Privacy-First**: API keys stored locally in browser, never sent to our servers

## Tech Stack

- **React 19** - UI Framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **PDF.js** - PDF rendering
- **React Markdown** - Markdown rendering for AI responses
- **Gemini 2.0 Flash** - AI model for analysis

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- Google AI Studio API key ([Get one here](https://aistudio.google.com/app/apikey))

### Installation

1. Clone this repository:
```bash
git clone https://github.com/chater-marzougui/Education-Help-Gemini.git
cd Education-Help-Gemini/Gemini_PDF_Helper
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Usage

1. **Configure API Key**: Enter your Google AI Studio API key on the setup page
2. **Upload PDF**: Drag and drop or select a PDF file (max 50MB)
3. **Navigate**: Use controls or keyboard shortcuts to navigate pages
4. **Analyze**: Click the AI button to analyze the current slide
5. **Ask Questions**: Use the chat interface to ask questions about the content

### Keyboard Shortcuts

- `←` / `→` - Previous/Next page
- `Enter` - Analyze current slide
- `+` / `-` - Zoom in/out (when not typing)
- `Home` / `End` - First/Last page

## Project Structure

```
Gemini_PDF_Helper/
├── src/
│   ├── components/
│   │   ├── app/
│   │   │   ├── ApiKeySetup.tsx      # API key configuration
│   │   │   ├── FileUpload.tsx       # PDF file upload
│   │   │   ├── PDFViewer.tsx        # PDF rendering and controls
│   │   │   └── ChatInterface.tsx    # Chat with AI
│   │   └── ui/                      # shadcn/ui components
│   ├── hooks/
│   │   └── useLocalStorage.ts       # localStorage hook
│   ├── services/
│   │   └── gemini.ts                # Gemini API integration
│   ├── types/
│   │   └── index.ts                 # TypeScript type definitions
│   ├── App.tsx                      # Main application component
│   └── main.tsx                     # Application entry point
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Security

- API keys are stored locally in your browser's localStorage
- No data is sent to any server except Google's Gemini API
- All processing happens client-side

## License

MIT License - see LICENSE file for details

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Acknowledgments

- Google Gemini AI for the powerful language model
- Mozilla PDF.js for PDF rendering
- shadcn/ui for beautiful UI components
