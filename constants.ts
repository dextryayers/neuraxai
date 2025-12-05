
import { AIProvider, AppSettings } from './types';

// --- KONFIGURASI ---
// API Key Gemini diambil secara otomatis dari environment variable (process.env.API_KEY)
// Tidak ada API Key hardcoded di sini lagi.

export const DEFAULT_SETTINGS: AppSettings = {
  provider: 'gemini',
  model: 'gemini-2.5-flash',
  temperature: 0.7,
  enableThinking: false,
  thinkingBudget: 0,
  enableWebSearch: false,
  systemInstruction: 'You are NeURAX AI, a sophisticated, highly intelligent assistant. Use Markdown for formatting.',
  userName: 'User',
};

export const PROVIDERS: { id: AIProvider; name: string }[] = [
  { id: 'gemini', name: 'Google Gemini' },
];

export const MODELS: Record<AIProvider, { id: string; name: string; description: string; supportsThinking?: boolean; supportsImages?: boolean }[]> = {
  gemini: [
    { 
      id: 'gemini-2.5-flash', 
      name: 'Gemini 2.5 Flash', 
      description: 'Balanced speed and intelligence.', 
      supportsImages: true 
    },
    { 
      id: 'gemini-2.5-flash-lite-latest', 
      name: 'Gemini 2.5 Flash Lite', 
      description: 'Fastest, lightweight tasks.', 
      supportsImages: true 
    },
    { 
      id: 'gemini-3-pro-preview', 
      name: 'Gemini 3.0 Pro', 
      description: 'Maximum reasoning power.', 
      supportsThinking: true,
      supportsImages: false 
    },
    {
      id: 'gemini-2.5-flash-thinking-latest', 
      name: 'Gemini 2.5 Flash Thinking', 
      description: 'Specialized in logic puzzles.',
      supportsThinking: true,
      supportsImages: true
    }
  ]
};
