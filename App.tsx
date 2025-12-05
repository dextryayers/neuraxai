import React, { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Sidebar from './components/Sidebar';
import ChatInterface from './components/ChatInterface';
import SettingsModal from './components/SettingsModal';
import { AppSettings, Conversation, Message, Attachment, RobotEmotion } from './types';
import { DEFAULT_SETTINGS, MODELS, PROVIDERS } from './constants';
import { streamGeminiResponse } from './services/geminiService';

const App: React.FC = () => {
  // State
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  
  // Robot State
  const [robotEmotion, setRobotEmotion] = useState<RobotEmotion>('idle');

  // Initial Load
  useEffect(() => {
    const savedSettings = localStorage.getItem('neurax_settings');
    const savedConversations = localStorage.getItem('neurax_conversations');
    
    if (savedSettings) setSettings(JSON.parse(savedSettings));
    if (savedConversations) {
        const parsed = JSON.parse(savedConversations);
        setConversations(parsed);
        if (parsed.length > 0) setCurrentId(parsed[0].id);
    }
  }, []);

  // Persistence
  useEffect(() => {
    localStorage.setItem('neurax_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('neurax_conversations', JSON.stringify(conversations));
  }, [conversations]);

  // Helpers
  const getCurrentConversation = () => conversations.find(c => c.id === currentId);

  const createNewConversation = () => {
    const newConv: Conversation = {
      id: uuidv4(),
      title: 'New Conversation',
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      provider: settings.provider
    };
    setConversations([newConv, ...conversations]);
    setCurrentId(newConv.id);
    setRobotEmotion('happy');
    setTimeout(() => setRobotEmotion('idle'), 2000);
  };

  const handleDeleteConversation = (id: string) => {
    const newConvs = conversations.filter(c => c.id !== id);
    setConversations(newConvs);
    if (currentId === id) {
      setCurrentId(newConvs.length > 0 ? newConvs[0].id : null);
    }
  };

  const updateConversationTitle = (id: string, firstMessage: string) => {
    setConversations(prev => prev.map(c => {
      if (c.id === id) {
        return { ...c, title: firstMessage.slice(0, 40) + (firstMessage.length > 40 ? '...' : '') };
      }
      return c;
    }));
  };

  // Core Logic
  const handleSendMessage = useCallback(async (text: string, attachments: Attachment[]) => {
    if (!currentId && conversations.length === 0) {
       createNewConversation();
    }
    
    let targetId = currentId;
    let targetConvs = [...conversations];

    if (!targetId) {
        const newConv: Conversation = {
            id: uuidv4(),
            title: text.slice(0, 30) || 'New Chat',
            messages: [],
            createdAt: Date.now(),
            updatedAt: Date.now(),
            provider: settings.provider
        };
        targetConvs = [newConv, ...conversations];
        setConversations(targetConvs);
        setCurrentId(newConv.id);
        targetId = newConv.id;
    }

    // 1. Add User Message
    const userMsg: Message = {
      id: uuidv4(),
      role: 'user',
      content: text,
      timestamp: Date.now(),
      attachments: attachments
    };

    const updatedConvsWithUser = targetConvs.map(c => 
      c.id === targetId ? { ...c, messages: [...c.messages, userMsg], updatedAt: Date.now() } : c
    );
    setConversations(updatedConvsWithUser);
    
    // Update title if it's the first message
    const currentConv = updatedConvsWithUser.find(c => c.id === targetId);
    if (currentConv && currentConv.messages.length === 1) {
       updateConversationTitle(targetId, text);
    }

    setIsLoading(true);
    setRobotEmotion('thinking');
    setStreamingContent('');

    // --- EXECUTE API CALLS ---
    try {
        if (settings.provider === 'gemini') {
            // GEMINI HANDLER
            streamGeminiResponse(
                settings,
                currentConv ? currentConv.messages : [], 
                text, 
                attachments,
                (chunk) => {
                    setStreamingContent(chunk);
                    if (Math.random() > 0.9) setRobotEmotion('listening');
                }, 
                (finalText, groundingSources) => {
                    finalizeMessage(targetId!, finalText, groundingSources);
                },
                (error) => handleError(targetId!, error)
            );
        } else {
             throw new Error("Unsupported or deprecated provider selected.");
        }
    } catch (error: any) {
        handleError(targetId!, error);
    }

  }, [conversations, currentId, settings]);

  // Common finalizer
  const finalizeMessage = (convId: string, content: string, groundingSources?: any[]) => {
      const aiMsg: Message = {
        id: uuidv4(),
        role: 'model',
        content: content,
        timestamp: Date.now(),
        groundingSources
      };
      setConversations(prev => prev.map(c => 
        c.id === convId ? { ...c, messages: [...c.messages, aiMsg], updatedAt: Date.now() } : c
      ));
      setIsLoading(false);
      setStreamingContent('');
      setRobotEmotion('happy');
      setTimeout(() => setRobotEmotion('idle'), 3000);
  };

  const handleError = (convId: string, error: any) => {
        const errorMsg: Message = {
            id: uuidv4(),
            role: 'model',
            content: `**System Alert:** ${error.message || "An unknown error occurred."}`,
            timestamp: Date.now()
        };
        setConversations(prev => prev.map(c => 
            c.id === convId ? { ...c, messages: [...c.messages, errorMsg], updatedAt: Date.now() } : c
        ));
        setIsLoading(false);
        setRobotEmotion('sad');
        setTimeout(() => setRobotEmotion('idle'), 4000);
  };

  const activeConv = getCurrentConversation();
  const providerName = PROVIDERS.find(p => p.id === settings.provider)?.name || 'AI';
  const modelName = MODELS[settings.provider]?.find(m => m.id === settings.model)?.name || settings.model;

  return (
    // FIXED INSET-0 forces the app to stick to the viewport exactly, no body scroll
    <div className="fixed inset-0 flex h-[100dvh] w-full bg-[#050b14] text-slate-100 overflow-hidden font-sans select-none">
      <Sidebar 
        conversations={conversations}
        currentId={currentId}
        onSelect={setCurrentId}
        onNew={createNewConversation}
        onDelete={handleDeleteConversation}
        onOpenSettings={() => setSettingsOpen(true)}
        isOpen={isSidebarOpen}
        onToggle={() => setSidebarOpen(!isSidebarOpen)}
      />

      {/* Main Container: also relative and strict overflow hidden to prevent children breakout */}
      <main className="flex-1 flex flex-col relative min-w-0 transition-all duration-300 overflow-hidden">
        <ChatInterface 
          messages={activeConv ? activeConv.messages : []}
          isLoading={isLoading}
          streamingContent={streamingContent}
          onSend={handleSendMessage}
          onToggleSidebar={() => setSidebarOpen(!isSidebarOpen)}
          providerName={providerName}
          modelName={modelName}
          isWebSearchEnabled={settings.enableWebSearch}
          isThinkingEnabled={settings.enableThinking}
          robotEmotion={robotEmotion}
        />
      </main>

      <SettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setSettingsOpen(false)}
        settings={settings}
        onSave={(newSettings) => {
            setSettings(newSettings);
            setRobotEmotion('happy');
            setTimeout(() => setRobotEmotion('idle'), 1500);
        }}
      />
    </div>
  );
};

export default App;