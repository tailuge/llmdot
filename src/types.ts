export interface Settings {
  prompt: string;
  apiKey: string;
}

export interface LLMResponse {
  error?: string;
  dotCode?: string;
  rawResponse?: any;
}