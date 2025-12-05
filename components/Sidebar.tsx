import React from 'react';
import { Plus, MessageSquare, Trash2, Search, Settings, ChevronLeft, Bot } from 'lucide-react';
import { Conversation } from '../types';

interface SidebarProps {
  conversations: Conversation[];
  currentId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
  onOpenSettings: () => void;
  isOpen: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  conversations,
  currentId,
  onSelect,
  onNew,
  onDelete,
  onOpenSettings,
  isOpen,
  onToggle
}) => {
  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onToggle}
      />

      <aside 
        className={`fixed md:relative z-40 flex flex-col h-full w-72 bg-[#0f172a]/80 backdrop-blur-xl border-r border-white/10 transition-transform duration-300 ease-[cubic-bezier(0.2,0,0,1)] ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0 md:w-72'
        } ${!isOpen && 'md:w-0 md:overflow-hidden md:border-none'}`}
      >
        <div className="flex flex-col h-full relative overflow-hidden">
            
          {/* Header */}
          <div className="p-4 bg-gradient-to-b from-white/5 to-transparent">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    {/* Logo Icon */}
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.3)] border border-white/10 group relative overflow-hidden">
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                        <Bot size={24} className="text-white relative z-10" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-300 tracking-tight drop-shadow-sm">NeURAX</h1>
                        <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                            <span className="text-[10px] text-green-400 font-mono tracking-widest uppercase">v2.1 ONLINE</span>
                        </div>
                    </div>
                </div>
                <button onClick={onToggle} className="md:hidden text-slate-400 hover:text-white">
                    <ChevronLeft size={20} />
                </button>
            </div>

            {/* New Chat Button */}
            <button
                onClick={() => {
                    onNew();
                    if (window.innerWidth < 768) onToggle();
                }}
                className="group flex items-center gap-2 w-full bg-gradient-to-r from-blue-600/20 to-purple-600/20 hover:from-blue-600/30 hover:to-purple-600/30 border border-white/10 text-white px-4 py-3 rounded-xl transition-all font-medium text-sm shadow-sm"
            >
                <div className="bg-white/10 p-1 rounded-full group-hover:scale-110 transition-transform">
                   <Plus size={14} className="text-white" />
                </div>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-purple-200">New Chat</span>
            </button>
          </div>

          {/* Search */}
          <div className="px-4 pb-2">
            <div className="relative group">
                <Search className="absolute left-3 top-2.5 text-slate-400 group-focus-within:text-purple-400 transition-colors" size={14} />
                <input 
                    type="text" 
                    placeholder="Search conversations..." 
                    className="w-full bg-black/20 border border-white/5 rounded-xl py-2 pl-9 pr-3 text-xs text-slate-200 focus:outline-none focus:border-purple-500/30 focus:bg-black/30 transition-all placeholder:text-slate-500"
                />
            </div>
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto px-2 space-y-0.5 custom-scrollbar pb-4">
            <h3 className="px-4 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">History</h3>
            
            {conversations.length === 0 ? (
                <div className="px-4 py-8 text-center">
                    <p className="text-xs text-slate-500 italic">No active sessions.</p>
                </div>
            ) : (
                conversations.map((conv) => (
                <div
                    key={conv.id}
                    className={`group relative flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer transition-all duration-200 border border-transparent ${
                    currentId === conv.id
                        ? 'bg-white/10 text-white border-white/5 shadow-inner'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                    }`}
                    onClick={() => {
                        onSelect(conv.id);
                        if (window.innerWidth < 768) onToggle();
                    }}
                >
                    <MessageSquare size={14} className={`flex-shrink-0 ${currentId === conv.id ? 'text-purple-400' : 'text-slate-600'}`} />
                    <span className="flex-1 truncate text-xs font-medium">
                    {conv.title || 'Untitled Session'}
                    </span>
                    
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(conv.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 transition-opacity p-1"
                    >
                    <Trash2 size={12} />
                    </button>
                </div>
                ))
            )}
          </div>

          {/* Bottom Actions */}
          <div className="p-4 border-t border-white/5 bg-black/20 backdrop-blur-md">
            <button
              onClick={onOpenSettings}
              className="flex items-center gap-3 w-full px-3 py-3 rounded-xl text-slate-300 hover:bg-white/10 hover:text-white transition-all group border border-transparent hover:border-white/5"
            >
              <Settings size={18} className="group-hover:rotate-90 transition-transform duration-500 text-slate-400 group-hover:text-purple-400" />
              <div className="flex flex-col items-start">
                  <span className="text-xs font-medium">Settings & Preferences</span>
              </div>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;