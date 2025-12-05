
export type Role = 'user' | 'model';

export type AIProvider = 'gemini';

export type RobotEmotion = 'idle' | 'listening' | 'thinking' | 'happy' | 'sad';

export interface Attachment {
  name: string;
  mimeType: string;
  data: string; // Base64
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface Message {
  id: string;
  role: Role;
  content: string;
  timestamp: number;
  attachments?: Attachment[];
  isThinking?: boolean;
  groundingSources?: GroundingSource[];
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
  provider: AIProvider;
}

export interface AppSettings {
  // API Key handled via process.env
  provider: AIProvider;
  model: string;
  temperature: number; // 0.0 to 1.0 (Strict to Creative)
  enableThinking: boolean;
  thinkingBudget: number;
  enableWebSearch: boolean;
  systemInstruction?: string;
  userName?: string;
}

export interface ChatState {
  conversations: Conversation[];
  currentConversationId: string | null;
  isSidebarOpen: boolean;
  isSettingsOpen: boolean;
  isLoading: boolean;
  streamingContent: string;
}
