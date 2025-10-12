import { useState, useEffect, useCallback } from 'react';
import { ApiKeySetup } from '@/components/app/ApiKeySetup';
import { FileUpload } from '@/components/app/FileUpload';
import { PDFViewer } from '@/components/app/PDFViewer';
import { ChatInterface } from '@/components/app/ChatInterface';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Upload } from 'lucide-react';
import type { ChatMessage } from '@/types';
import { sendToGemini } from '@/services/gemini';
import { useLocalStorage } from '@/hooks/useLocalStorage';

type AppView = 'setup' | 'upload' | 'viewer';

function App() {
  const [apiKey, setApiKey] = useLocalStorage<string>('gemini_api_key', '');
  const [view, setView] = useState<AppView>('setup');
  const [file, setFile] = useState<File | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [currentImageData, setCurrentImageData] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'system',
      content: 'Welcome! Upload a PDF and I\'ll help explain each slide. You can also ask me questions about the content.',
      timestamp: Date.now()
    }
  ]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Check for saved API key on mount
  useEffect(() => {
    if (apiKey) {
      setView('upload');
    }
  }, []);

  const handleApiKeyValidated = useCallback((key: string) => {
    setApiKey(key);
    setView('upload');
  }, [setApiKey]);

  const handleFileSelect = useCallback((selectedFile: File) => {
    setFile(selectedFile);
    setView('viewer');
    setCurrentPage(1);
    setMessages([
      {
        role: 'system',
        content: `PDF "${selectedFile.name}" loaded successfully! You can now ask questions or analyze slides.`,
        timestamp: Date.now()
      }
    ]);
  }, []);

  const handleBackToSetup = useCallback(() => {
    setView('setup');
    setFile(null);
    setApiKey('');
  }, [setApiKey]);

  const handleUploadNew = useCallback(() => {
    setView('upload');
    setFile(null);
    setCurrentPage(1);
    setMessages([
      {
        role: 'system',
        content: 'Welcome! Upload a PDF and I\'ll help explain each slide.',
        timestamp: Date.now()
      }
    ]);
  }, []);

  const handleSendMessage = useCallback(async (message: string) => {
    if (!apiKey || isAnalyzing) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: message,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsAnalyzing(true);

    try {
      const response = await sendToGemini(apiKey, message, currentImageData, messages);
      
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response.content,
        type: response.type,
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        role: 'error',
        content: `Failed to send message: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsAnalyzing(false);
    }
  }, [apiKey, currentImageData, messages, isAnalyzing]);

  const handleAnalyzeSlide = useCallback(async () => {
    if (!apiKey || isAnalyzing || !currentImageData) return;

    const message = `Please analyze this slide (page ${currentPage}) and provide a clear explanation of its content, key points, and any important details.`;
    
    const systemMessage: ChatMessage = {
      role: 'system',
      content: `Analyzing page ${currentPage}...`,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, systemMessage]);
    setIsAnalyzing(true);

    try {
      const response = await sendToGemini(apiKey, message, currentImageData, messages);
      
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response.content,
        type: response.type,
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        role: 'error',
        content: `Failed to analyze slide: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsAnalyzing(false);
    }
  }, [apiKey, currentImageData, currentPage, messages, isAnalyzing]);

  const handleClearChat = useCallback(() => {
    setMessages([
      {
        role: 'system',
        content: 'Chat cleared. You can start a new conversation.',
        timestamp: Date.now()
      }
    ]);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (view !== 'viewer' || !file) return;

      // Don't handle shortcuts if user is typing in textarea
      if ((e.target as HTMLElement).tagName === 'TEXTAREA') return;

      switch (e.key) {
        case 'ArrowLeft':
          if (currentPage > 1) setCurrentPage(currentPage - 1);
          break;
        case 'ArrowRight':
          setCurrentPage(currentPage + 1);
          break;
        case 'Enter':
          e.preventDefault();
          handleAnalyzeSlide();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [view, file, currentPage, handleAnalyzeSlide]);

  if (view === 'setup') {
    return <ApiKeySetup onApiKeyValidated={handleApiKeyValidated} initialApiKey={apiKey} />;
  }

  if (view === 'upload') {
    return (
      <div className="relative">
        <div className="absolute top-4 left-4 z-10">
          <Button variant="outline" onClick={handleBackToSetup}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Setup
          </Button>
        </div>
        <FileUpload onFileSelect={handleFileSelect} />
      </div>
    );
  }

  if (view === 'viewer' && file) {
    return (
      <div className="h-screen flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-card border-b">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={handleBackToSetup}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Setup
            </Button>
            <Button variant="outline" size="sm" onClick={handleUploadNew}>
              <Upload className="h-4 w-4 mr-2" />
              New PDF
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">📄</span>
            <span className="text-sm font-medium">{file.name}</span>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 flex overflow-hidden">
          {/* PDF Viewer */}
          <div className="flex-1 min-w-0">
            <PDFViewer
              file={file}
              currentPage={currentPage}
              scale={scale}
              onPageChange={setCurrentPage}
              onScaleChange={setScale}
              onPageRender={setCurrentImageData}
            />
          </div>

          {/* Chat Interface */}
          <div className="w-96 border-l">
            <ChatInterface
              messages={messages}
              onSendMessage={handleSendMessage}
              onAnalyzeSlide={handleAnalyzeSlide}
              onClearChat={handleClearChat}
              isAnalyzing={isAnalyzing}
            />
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export default App;
