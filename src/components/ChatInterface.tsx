
import React, { useRef, useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Send, Paperclip, Loader2, User, Copy, Check, Menu, Globe, Brain, Sparkles, Clock } from 'lucide-react';
import { Message, Attachment, RobotEmotion } from '../types';
import RobotAvatar from './RobotAvatar';

interface ChatInterfaceProps {
  messages: Message[];
  isLoading: boolean;
  streamingContent: string;
  onSend: (text: string, attachments: Attachment[]) => void;
  onToggleSidebar: () => void;
  providerName: string;
  modelName: string;
  isWebSearchEnabled: boolean;
  isThinkingEnabled: boolean;
  robotEmotion: RobotEmotion;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  isLoading,
  streamingContent,
  onSend,
  onToggleSidebar,
  providerName,
  modelName,
  isWebSearchEnabled,
  isThinkingEnabled,
  robotEmotion
}) => {
  const [input, setInput] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Clock Timer
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Date Formatters
  const timeString = currentTime.toLocaleTimeString([], { hour12: false });
  const dateString = currentTime.toLocaleDateString([], { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingContent]);

  const handleSend = () => {
    if ((!input.trim() && attachments.length === 0) || isLoading) return;
    onSend(input, attachments);
    setInput('');
    setAttachments([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files) as File[];
      const newAttachments: Attachment[] = [];

      for (const file of filesArray) {
        const reader = new FileReader();
        await new Promise<void>((resolve) => {
          reader.onload = (event) => {
            if (event.target?.result) {
              newAttachments.push({
                name: file.name,
                mimeType: file.type,
                data: event.target.result as string,
              });
            }
            resolve();
          };
          reader.readAsDataURL(file);
        });
      }
      setAttachments([...attachments, ...newAttachments]);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-transparent relative font-sans">
      
      {/* Header (Glass & Minimal) */}
      <header className="flex items-center justify-between px-6 py-4 bg-transparent border-b border-white/5 z-20">
        <div className="flex items-center gap-4">
            <button onClick={onToggleSidebar} className="text-slate-300 hover:text-white md:hidden">
                <Menu size={20} />
            </button>
            <div className="flex items-center gap-3">
                {/* Mini Robot Head Status Indicator */}
                <div className="relative">
                     <RobotAvatar emotion={isLoading ? "thinking" : "idle"} size="xs" />
                     {/* Online dot absolute */}
                     <span className="absolute -bottom-0.5 -right-0.5 flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                     </span>
                </div>
                
                <div className="glass-panel px-3 py-1 rounded-full border border-white/10">
                    <h2 className="text-xs font-bold text-slate-200 tracking-wide flex items-center gap-2">
                        System Ready
                        {isThinkingEnabled && <Brain size={12} className="text-purple-400" />}
                        {isWebSearchEnabled && <Globe size={12} className="text-green-400" />}
                    </h2>
                </div>
            </div>
        </div>

        {/* Real-time Clock & Date Display */}
        <div className="flex items-center gap-3">
            <div className="hidden md:flex flex-col items-end">
                <div className="flex items-center gap-2">
                    <Clock size={12} className="text-neonBlue animate-pulse" />
                    <span className="text-xs font-mono text-neonBlue font-bold tracking-wider tabular-nums shadow-[0_0_10px_rgba(0,243,255,0.2)]">{timeString}</span>
                </div>
                <span className="text-[10px] text-slate-500 font-medium uppercase tracking-widest">{dateString}</span>
            </div>
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 custom-scrollbar scroll-smooth">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-[70vh] text-slate-400 animate-in fade-in zoom-in duration-700">
             
             {/* Robot Assembly - KEPT THE FIXED VERSION + ULTRA ENHANCED BACKGROUND STAGE */}
             <div className="relative mb-16 group scale-125">
                
                {/* --- ADVANCED HOLOGRAPHIC STAGE & NEBULA --- */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none z-0">
                    
                    {/* 1. Deep Core Glow (Pulse) */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-900/30 rounded-full blur-[60px] animate-pulse-slow mix-blend-screen"></div>
                    
                    {/* 2. Rotating Cyber Rings (Floor Perspective) */}
                    {/* Outer Ring (Slow Blue) */}
                    <div className="absolute top-[55%] left-1/2 -translate-x-1/2 w-80 h-80 border border-blue-500/10 rounded-full scale-y-[0.25] animate-[spin_20s_linear_infinite]"></div>
                    {/* Middle Ring (Reverse Purple Dashed) */}
                    <div className="absolute top-[58%] left-1/2 -translate-x-1/2 w-60 h-60 border border-dashed border-purple-500/20 rounded-full scale-y-[0.25] animate-[spin_15s_linear_infinite_reverse]"></div>
                    {/* Inner Ring (Fast Cyan Dotted) */}
                    <div className="absolute top-[60%] left-1/2 -translate-x-1/2 w-40 h-40 border-2 border-dotted border-cyan-400/20 rounded-full scale-y-[0.25] animate-[spin_10s_linear_infinite]"></div>

                    {/* 3. Vertical Light Column (Rising Energy) */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[40%] w-32 h-64 bg-gradient-to-t from-blue-500/20 via-purple-500/5 to-transparent blur-2xl"></div>
                </div>

                <div className="flex flex-col items-center relative z-10">
                    
                    {/* --- SPEECH BUBBLE POPUP --- */}
                    <div className="absolute -top-24 -right-24 z-[100] animate-pop-bounce delay-150 opacity-0 origin-bottom-left">
                        <div className="bg-white text-slate-900 px-4 py-3 rounded-2xl rounded-bl-sm shadow-[0_0_20px_rgba(255,255,255,0.4)] border border-blue-200 relative max-w-[180px]">
                           <span className="text-xs font-bold leading-tight block">Ahoy, welcome to NeURAX AI 👋</span>
                           {/* Tail */}
                           <div className="absolute bottom-[-6px] left-[0px] w-4 h-4 bg-white border-r border-b border-blue-200 transform rotate-45 skew-x-12"></div>
                        </div>
                    </div>

                    {/* Base Emitter (Direct contact) */}
                    <div className="absolute -bottom-12 w-32 h-8 bg-blue-500/30 rounded-[100%] blur-md z-0 animate-pulse"></div>
                    <div className="absolute -bottom-12 w-20 h-2 bg-white/30 rounded-[100%] blur-[2px] z-0"></div>

                    {/* Head (Top Layer z-40) */}
                    <div className="z-40 relative">
                        <RobotAvatar emotion="idle" size="lg" />
                    </div>
                    {/* Neck */}
                    <div className="w-8 h-3 bg-slate-700 -mt-1 relative z-20 rounded-sm"></div>
                    {/* Body Assembly */}
                    <div className="relative mt-[-2px] flex justify-center"> 
                        {/* Left Arm (Waving) - Layer z-10 */}
                        <div className="absolute top-[22px] right-[55px] z-10 origin-top animate-wave">
                                <div className="w-7 h-16 bg-gradient-to-r from-slate-600 to-slate-500 rounded-b-2xl rounded-t-full border border-slate-400/20 shadow-lg relative flex flex-col items-center justify-end">
                                    <div className="absolute top-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-slate-400 rounded-full"></div>
                                    <div className="absolute top-4 left-1/2 -translate-x-1/2 w-1 h-1 bg-slate-400 rounded-full"></div>
                                    <div className="lego-hand scale-75 border-slate-400 bg-slate-300/20 absolute -bottom-3"></div>
                                </div>
                        </div>
                        
                        {/* Right Arm (Static) - Layer z-10 */}
                        <div className="absolute top-[8px] -right-[70px] z-10 origin-top transform rotate-[5deg]">
                            <div className="w-7 h-16 bg-gradient-to-l from-slate-600 to-slate-500 rounded-b-2xl rounded-t-full border border-slate-400/20 shadow-lg relative flex flex-col items-center justify-end">
                                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-slate-400 rounded-full"></div>
                                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-1 h-1 bg-slate-400 rounded-full"></div>
                                <div className="lego-hand scale-75 border-slate-400 bg-slate-300/20 absolute -bottom-3"></div>
                            </div>
                        </div>

                        {/* Main Torso - Layer z-20 */}
                        <div className="w-24 h-20 bg-slate-800 rounded-xl rounded-t-2xl border border-white/10 shadow-2xl flex flex-col items-center relative z-20 overflow-hidden">
                            <div className="mt-4 w-10 h-10 bg-black/60 rounded-full border border-slate-600 flex items-center justify-center shadow-inner">
                                <div className="w-6 h-6 rounded-full bg-neonBlue/10 animate-pulse border border-neonBlue/30 flex items-center justify-center">
                                    <div className="w-2 h-2 bg-neonBlue rounded-full shadow-[0_0_8px_#00f3ff]"></div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Shoulder Joints - Layer z-30 (Covers Arm Pivot) */}
                        <div className="absolute top-[-4px] left-[-12px] w-6 h-6 bg-slate-600 rounded-full z-30 border border-slate-500/50 shadow-md"></div>
                        <div className="absolute top-[-4px] right-[-12px] w-6 h-6 bg-slate-600 rounded-full z-30 border border-slate-500/50 shadow-md"></div>
                    </div>
                </div>
             </div>

             <div className="text-center space-y-3 relative px-8 py-2">
                {/* Blink Blink Sparkles */}
                <Sparkles className="absolute -left-2 top-2 text-yellow-300 w-6 h-6 animate-twinkle" />
                <Sparkles className="absolute left-6 -top-4 text-white w-4 h-4 animate-twinkle delay-300" />
                <Sparkles className="absolute -right-2 bottom-2 text-blue-300 w-5 h-5 animate-twinkle delay-75" />
                <Sparkles className="absolute right-8 -top-2 text-purple-300 w-3 h-3 animate-twinkle delay-150" />
                <Sparkles className="absolute right-12 bottom-6 text-pink-300 w-2 h-2 animate-twinkle delay-500" />
                
                {/* Main Title with 3-COLOR (Blue, Purple, White) ANIMATION */}
                <h3 
                  className="text-5xl font-black text-transparent bg-clip-text animate-disco tracking-tight"
                  style={{
                    /* 3-Color Gradient: Blue -> Purple -> White -> Purple -> Blue */
                    backgroundImage: 'linear-gradient(to right, #2563eb, #9333ea, #ffffff, #9333ea, #2563eb)',
                    backgroundSize: '200% auto',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    filter: 'drop-shadow(0 0 10px rgba(147, 51, 234, 0.4))'
                  }}
                >
                    NeURAX AI
                </h3>
                <p className="text-sm text-slate-300 font-medium">How can I help you today?</p>
             </div>
          </div>
        )}
        
        <div className="w-full max-w-3xl mx-auto space-y-6">
            {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
            ))}

            {isLoading && (
            <div className="flex justify-start w-full animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="flex gap-4 max-w-[85%]">
                    <div className="mt-1 hidden md:block">
                        <RobotAvatar emotion="thinking" size="sm" />
                    </div>
                    <div className="glass-panel border-purple-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
                        <div className="flex items-center gap-3 mb-3 border-b border-white/5 pb-2">
                           <Loader2 size={14} className="text-purple-400 animate-spin" />
                           <span className="text-[10px] font-mono font-bold text-purple-400 uppercase tracking-widest">Processing...</span>
                        </div>
                        <div className="markdown-body text-slate-200 text-sm leading-relaxed">
                        {streamingContent ? (
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{streamingContent}</ReactMarkdown>
                        ) : (
                            <div className="flex items-center gap-1 h-6">
                                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce"></span>
                                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce delay-75"></span>
                                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce delay-150"></span>
                            </div>
                        )}
                        </div>
                    </div>
                </div>
            </div>
            )}
            <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area (Glass Effect) */}
      <div className="bg-transparent p-4 z-20">
        <div className="max-w-3xl mx-auto">
            {/* Attachments Preview */}
            {attachments.length > 0 && (
                <div className="flex gap-2 mb-3 overflow-x-auto py-1">
                {attachments.map((file, idx) => (
                    <div key={idx} className="bg-slate-800/80 text-xs text-white px-3 py-2 rounded-lg flex items-center gap-2 border border-white/10 shadow-sm animate-in slide-in-from-bottom-2">
                        <Paperclip size={12} className="text-neonBlue"/>
                        <span className="truncate max-w-[150px]">{file.name}</span>
                        <button onClick={() => setAttachments(prev => prev.filter((_, i) => i !== idx))} className="hover:text-red-400 ml-1">
                            &times;
                        </button>
                    </div>
                ))}
                </div>
            )}

            {/* 
                FORCEFUL RGB GLOW IMPLEMENTATION:
                1. Removed shadow-2xl to prevent darkness overlap
                2. Added transform: translateZ(0) for GPU compositing
                3. Kept relative positioning for ::after/::before anchors
            */}
            <div 
              className="glass-panel rgb-input-glow rounded-2xl p-2 flex items-end gap-2 relative z-20 transition-all"
              style={{ transform: 'translateZ(0)' }}
            >
                <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="p-3 text-slate-400 hover:text-white transition-colors hover:bg-white/5 rounded-xl"
                >
                <Paperclip size={20} />
                </button>
                <input type="file" ref={fileInputRef} className="hidden" multiple onChange={handleFileChange} />

                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message to NeURAX..."
                    className="w-full bg-transparent border-none focus:ring-0 text-white placeholder-slate-400 resize-none max-h-48 text-sm custom-scrollbar leading-relaxed py-3 relative z-10"
                    rows={1}
                    style={{ minHeight: '44px' }}
                />

                <button
                onClick={handleSend}
                disabled={isLoading || (!input.trim() && attachments.length === 0)}
                className="p-3 bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-500 hover:to-purple-500 transition-all shadow-lg hover:shadow-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:grayscale relative z-10"
                >
                {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                </button>
            </div>
            <div className="text-center mt-2">
                 <p className="text-[10px] text-slate-400/80">AI can make mistakes. Please verify important information.</p>
            </div>
        </div>
      </div>

    </div>
  );
};

// Standard Message Bubble (Vibrant Design)
const MessageBubble: React.FC<{ message: Message }> = ({ message }) => {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const timeString = new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300 group`}>
      <div className={`flex gap-4 max-w-[90%] md:max-w-[85%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
          
          {/* Avatar */}
          <div className={`mt-1 flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center border shadow-sm ${isUser ? 'bg-gradient-to-br from-blue-600 to-purple-600 border-transparent text-white' : 'hidden md:flex'}`}>
                {isUser ? <User size={14} className="text-white" /> : <RobotAvatar emotion="idle" size="sm" />}
          </div>

          <div className="flex flex-col gap-1 min-w-0">
             <div className={`flex items-center gap-2 ${isUser ? 'justify-end' : 'justify-start'} px-1`}>
                <span className="text-[10px] text-slate-400 font-medium">{isUser ? 'You' : 'NeURAX'}</span>
                <span className="text-[10px] text-slate-500">•</span>
                <span className="text-[10px] text-slate-500">{timeString}</span>
             </div>

             <div className={`
                relative px-5 py-4 shadow-md transition-all
                ${isUser 
                    ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-2xl rounded-tr-sm shadow-blue-500/10' 
                    : 'glass-panel text-slate-200 rounded-2xl rounded-tl-sm'}
             `}>
                <div className="markdown-body text-sm leading-relaxed">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {message.content}
                    </ReactMarkdown>
                </div>

                {/* Attachments */}
                {message.attachments && message.attachments.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-white/20 grid grid-cols-2 gap-2">
                        {message.attachments.map((att, i) => (
                            <div key={i} className="bg-black/20 p-2 rounded flex items-center gap-2 overflow-hidden">
                                <Paperclip size={12} className="text-white/70 flex-shrink-0"/>
                                <span className="text-xs truncate">{att.name}</span>
                            </div>
                        ))}
                    </div>
                )}

                {/* Grounding Sources */}
                {message.groundingSources && message.groundingSources.length > 0 && (
                <div className="mt-3 pt-3 border-t border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                        <Globe size={12} className="text-green-400" />
                        <span className="text-[10px] font-bold text-green-400 uppercase">Sources</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {message.groundingSources.map((source, idx) => (
                            <a 
                            key={idx} 
                            href={source.uri} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-[10px] bg-white/5 hover:bg-white/10 text-slate-300 px-2 py-1 rounded border border-white/5 transition-colors truncate max-w-[200px]"
                            >
                            {idx + 1}. {source.title}
                            </a>
                        ))}
                    </div>
                </div>
                )}
            </div>

            {/* Actions */}
            {!isUser && (
                <div className="flex gap-2 px-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                    onClick={handleCopy} 
                    className="text-slate-400 hover:text-white transition-colors"
                    title="Copy to clipboard"
                    >
                    {copied ? <Check size={14} className="text-green-500"/> : <Copy size={14}/>}
                    </button>
                </div>
            )}
         </div>
      </div>
    </div>
  );
};

export default ChatInterface;
