import { useEffect, useRef, useState } from "react";
import type { ChatMessage } from "@/types";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Bot, Trash2 } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  onAnalyzeSlide: () => void;
  onClearChat: () => void;
  isAnalyzing: boolean;
}

function getMessageBgColor(role: string) {
  switch (role) {
    case "user":
      return "bg-primary text-primary-foreground";
    case "system":
      return "bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100";
    case "error":
      return "bg-red-100 text-red-900 dark:bg-red-900 dark:text-red-100";
    default:
      return "bg-muted";
  }
}

export function ChatInterface({
  messages,
  onSendMessage,
  onAnalyzeSlide,
  onClearChat,
  isAnalyzing,
}: Readonly<ChatInterfaceProps>) {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (input.trim() && !isAnalyzing) {
      onSendMessage(input.trim());
      setInput("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    // Auto-resize
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 150) + "px";
  };

  return (
    <div className="flex flex-col h-full bg-card max-h-[90vh] ">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          <h3 className="font-semibold">AI Assistant</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {messages.filter((m) => m.role === "user").length} messages
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearChat}
            title="Clear chat"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index + 1}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${getMessageBgColor(
                message.role
              )}`}
            >
              {message.type === "markdown" && message.role !== "user" ? (
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                </div>
              ) : (
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              )}
              {message.timestamp && (
                <p className="text-xs opacity-70 mt-1">
                  {new Date(message.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              )}
            </div>
          </div>
        ))}
        {isAnalyzing && (
          <div className="flex justify-start">
            <div className="bg-muted rounded-lg p-3">
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                <span className="text-sm">AI is thinking...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t space-y-2">
        <div className="flex gap-2">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder="Ask a question about the slide..."
            className="resize-none min-h-[70px]"
            disabled={isAnalyzing}
          />
          <div className="flex flex-col gap-2">
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isAnalyzing}
              size="sm"
            >
              <Send className="h-4 w-4" />
            </Button>
            <Button
              onClick={onAnalyzeSlide}
              disabled={isAnalyzing}
              variant="outline"
              size="sm"
              title="Analyze current slide"
            >
              <Bot className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
