export interface ChatMessage {
  role: 'user' | 'assistant' | 'system' | 'error';
  content: string;
  type?: 'text' | 'markdown';
  timestamp?: number;
}

export interface PDFViewerState {
  currentPage: number;
  totalPages: number;
  scale: number;
  fileName: string;
}

export interface GeminiResponse {
  candidates?: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

export interface ApiKeyConfig {
  key: string;
  validated: boolean;
}

export type GeminiModel = 'gemini-2.0-flash-exp' | 'gemini-1.5-flash' | 'gemini-1.5-pro';

export interface ModelConfig {
  id: GeminiModel;
  name: string;
  description: string;
}
