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
