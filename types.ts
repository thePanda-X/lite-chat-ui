export interface UsageMetadata {
  promptTokenCount?: number;
  candidatesTokenCount?: number;
  totalTokenCount?: number;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'model';
  content: string;
  thinking?: string;
  timestamp: number;
  usage?: UsageMetadata;
  timing?: number;
  isError?: boolean;
}

export type Provider = 'ollama';

export interface OllamaModel {
  name: string;
  size: number;
  digest: string;
  modified_at: string;
}
