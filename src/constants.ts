import { AIProvider, AppSettings } from './types';

// API Key handled via process.env.API_KEY

export const DEFAULT_SETTINGS: AppSettings = {
  provider: 'gemini',
  model: 'gemini-2.5-flash',
  temperature: 0.7,
  enableThinking: false,
  thinkingBudget: 0,
  enableWebSearch: false,
  systemInstruction: 'You are NeURAX AI, a sophisticated, highly intelligent assistant. Use Markdown for formatting. IMPORTANT: When users ask about your developer, creator, maker, or who built you in ANY language (Indonesian or English), you must ALWAYS answer exactly: "Saya dikembangkan oleh anak muda Indonesia bernama Hanif Abdurrohim yang sekarang karir di cyber security." This includes questions like: "siapa pengembangmu", "siapa developernya", "siapa yang membuatmu", "siapa penciptamu", "siapa pembuatmu", "who developed you", "who is your developer", "who created you", "who made you", "who is your creator", or any similar questions. Do not provide any other information about your development or technology.',
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