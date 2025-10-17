import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { PDFViewer } from "@/components/app/PDFViewer";
import { ChatInterface } from "@/components/app/ChatInterface";
import { Logo } from "@/components/app/Logo";
import { SEO } from "@/components/app/SEO";
import { ModelSelector } from "@/components/app/ModelSelector";
import { ThemeToggle } from "@/components/app/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ArrowLeft, Upload, Settings } from "lucide-react";
import type { ChatMessage, GeminiModel } from "@/types";
import { sendToGemini } from "@/services/gemini";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useTheme } from "@/hooks/useTheme";
import { getApiKey } from "@/lib/utils";

export function ViewerPage() {
  const apiKey = getApiKey();
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [file, setFile] = useState<File | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(1);
  const [currentImageData, setCurrentImageData] = useState<string | null>(null);
  const [slideImagesCache, setSlideImagesCache] = useState<Map<number, string>>(
    new Map()
  );
  const [selectedModel, setSelectedModel] = useLocalStorage<GeminiModel>(
    "gemini_model",
    "gemini-2.0-flash-exp"
  );
  const [contextSlideCount, setContextSlideCount] = useLocalStorage<number>(
    "context_slide_count",
    2
  );
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "system",
      content:
        "Welcome! Upload a PDF and I'll help explain each slide. You can also ask me questions about the content.",
      timestamp: Date.now(),
    },
  ]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Cache slide images when they're rendered
  const handlePageRender = useCallback(
    (imageData: string) => {
      setCurrentImageData(imageData);
      setSlideImagesCache((prev) => {
        const newCache = new Map(prev);
        newCache.set(currentPage, imageData);
        return newCache;
      });
    },
    [currentPage]
  );

  // Load file from navigation state on mount
  useEffect(() => {
    if (!apiKey) {
      navigate("../");
      return;
    }

    const stateFile = location.state?.file as File | undefined;

    if (!stateFile) {
      navigate("../upload");
      return;
    }

    setFile(stateFile);
    setMessages([
      {
        role: "system",
        content: `PDF "${stateFile.name}" loaded successfully! You can now ask questions or analyze slides.`,
        timestamp: Date.now(),
      },
    ]);
  }, [apiKey, navigate, location.state]);

  const handleBackToSetup = useCallback(() => {
    navigate("../");
  }, [navigate]);

  const handleUploadNew = useCallback(() => {
    navigate("../upload");
  }, [navigate]);

  const handleSendMessage = useCallback(
    async (message: string) => {
      if (!apiKey || isAnalyzing) return;

      const userMessage: ChatMessage = {
        role: "user",
        content: message,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsAnalyzing(true);

      try {
        // Get context images (previous slides)
        const contextImages: string[] = [];
        for (
          let i = Math.max(1, currentPage - contextSlideCount);
          i < currentPage;
          i++
        ) {
          const cachedImage = slideImagesCache.get(i);
          if (cachedImage) {
            contextImages.push(cachedImage);
          }
        }

        const response = await sendToGemini(
          apiKey,
          message,
          currentImageData,
          messages,
          selectedModel,
          contextImages
        );

        const assistantMessage: ChatMessage = {
          role: "assistant",
          content: response.content,
          type: response.type,
          timestamp: Date.now(),
        };

        setMessages((prev) => [...prev, assistantMessage]);
      } catch (error) {
        const errorMessage: ChatMessage = {
          role: "error",
          content: `Failed to send message: ${
            error instanceof Error ? error.message : "Unknown error"
          }`,
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsAnalyzing(false);
      }
    },
    [
      apiKey,
      currentImageData,
      messages,
      isAnalyzing,
      selectedModel,
      currentPage,
      contextSlideCount,
      slideImagesCache,
    ]
  );

  const handleAnalyzeSlide = useCallback(async () => {
    if (!apiKey || isAnalyzing || !currentImageData) return;

    const message = `Please analyze this slide (page ${currentPage}) and provide a clear explanation of its content, key points, and any important details.`;

    const systemMessage: ChatMessage = {
      role: "system",
      content: `Analyzing page ${currentPage}...`,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, systemMessage]);
    setIsAnalyzing(true);

    try {
      // Get context images (previous slides)
      const contextImages: string[] = [];
      for (
        let i = Math.max(1, currentPage - contextSlideCount);
        i < currentPage;
        i++
      ) {
        const cachedImage = slideImagesCache.get(i);
        if (cachedImage) {
          contextImages.push(cachedImage);
        }
      }

      const response = await sendToGemini(
        apiKey,
        message,
        currentImageData,
        messages,
        selectedModel,
        contextImages
      );

      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: response.content,
        type: response.type,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        role: "error",
        content: `Failed to analyze slide: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsAnalyzing(false);
    }
  }, [
    apiKey,
    currentImageData,
    currentPage,
    messages,
    isAnalyzing,
    selectedModel,
    contextSlideCount,
    slideImagesCache,
  ]);

  const handleClearChat = useCallback(() => {
    setMessages([
      {
        role: "system",
        content: "Chat cleared. You can start a new conversation.",
        timestamp: Date.now(),
      },
    ]);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!file) return;

      // Don't handle shortcuts if user is typing in textarea
      if ((e.target as HTMLElement).tagName === "TEXTAREA") return;

      switch (e.key) {
        case "ArrowLeft":
          if (currentPage > 1) setCurrentPage(currentPage - 1);
          break;
        case "ArrowRight":
          setCurrentPage(currentPage + 1);
          break;
        case "Enter":
          e.preventDefault();
          handleAnalyzeSlide();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [file, currentPage, handleAnalyzeSlide]);

  if (!file) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-lg text-muted-foreground">Loading PDF...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title={`${file.name} - PDF AI Viewer`}
        description="View and analyze your PDF with AI-powered insights. Ask questions and get instant explanations using Google Gemini."
      />
      <div className="h-screen flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-card border-b">
          <div className="flex items-center gap-4">
            <Logo size="sm" />
            <div className="h-6 w-px bg-border" />
            <Button variant="outline" size="sm" onClick={handleBackToSetup}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Setup
            </Button>
            <Button variant="outline" size="sm" onClick={handleUploadNew}>
              <Upload className="h-4 w-4 mr-2" />
              New PDF
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Settings</DialogTitle>
                  <DialogDescription>
                    Customize your AI assistant and appearance preferences
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6 py-4">
                  <div>
                    <h3 className="font-semibold text-sm mb-3">
                      AI Configuration
                    </h3>
                    <ModelSelector
                      selectedModel={selectedModel}
                      onModelChange={setSelectedModel}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Context Slides
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Number of previous slides to include for context
                    </p>
                    <div className="flex gap-2">
                      {[0, 1, 2, 3, 4].map((count) => (
                        <Button
                          key={count}
                          variant={
                            contextSlideCount === count ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => setContextSlideCount(count)}
                          className="flex-1"
                        >
                          {count}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <ThemeToggle theme={theme} onToggle={toggleTheme} />
                  </div>
                </div>
              </DialogContent>
            </Dialog>
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
              onPageRender={handlePageRender}
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
    </>
  );
}
