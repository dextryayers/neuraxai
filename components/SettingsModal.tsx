
import React, { useState, useEffect } from 'react';
import { X, Save, Cpu, Zap, Search, Brain, Gauge } from 'lucide-react';
import { AppSettings } from '../types';
import { MODELS, PROVIDERS } from '../constants';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onSave: (newSettings: AppSettings) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, settings, onSave }) => {
  const [localSettings, setLocalSettings] = useState<AppSettings>(settings);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(localSettings);
    onClose();
  };

  const currentModels = MODELS[localSettings.provider] || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="glass-panel w-full max-w-lg rounded-3xl flex flex-col max-h-[90vh] shadow-[0_0_50px_rgba(0,243,255,0.1)]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/5">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Cpu className="text-neonBlue" /> Neural Core Settings
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition hover:rotate-90 duration-200">
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          
          {/* Provider Selection */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-300 uppercase tracking-wider">AI Provider</label>
            <div className="grid grid-cols-2 gap-2">
              {PROVIDERS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setLocalSettings({ ...localSettings, provider: p.id, model: MODELS[p.id][0].id })}
                  className={`p-3 rounded-xl text-sm border transition-all duration-300 ${
                    localSettings.provider === p.id
                      ? 'bg-blue-600/30 border-neonBlue text-white shadow-[0_0_15px_rgba(0,243,255,0.2)]'
                      : 'bg-slate-800/50 border-white/5 text-slate-400 hover:bg-white/5'
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          {/* Model Selection */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Model Architecture</label>
            <div className="relative">
                <select
                value={localSettings.model}
                onChange={(e) => setLocalSettings({ ...localSettings, model: e.target.value })}
                className="w-full bg-slate-800/50 border border-white/10 rounded-xl p-4 text-sm text-white outline-none appearance-none focus:border-neonBlue transition-colors"
                >
                {currentModels.map((m) => (
                    <option key={m.id} value={m.id}>
                    {m.name}
                    </option>
                ))}
                </select>
                <div className="absolute right-4 top-4 text-slate-400 pointer-events-none">
                    <Zap size={16} />
                </div>
            </div>
            <p className="text-xs text-blue-300/80 pl-1">
              {currentModels.find(m => m.id === localSettings.model)?.description}
            </p>
          </div>

          {/* Response Style (Temperature) */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
                 <label className="text-sm font-semibold text-slate-300 uppercase tracking-wider flex gap-2 items-center">
                    <Gauge size={16} /> Response Style
                 </label>
                 <span className="text-xs text-neonBlue font-mono">{localSettings.temperature.toFixed(1)}</span>
            </div>
            
            <input 
                type="range" 
                min="0" 
                max="1.5" 
                step="0.1"
                value={localSettings.temperature}
                onChange={(e) => setLocalSettings({...localSettings, temperature: parseFloat(e.target.value)})}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-neonBlue"
                disabled={localSettings.enableThinking}
            />
            <div className="flex justify-between text-xs text-slate-500 font-medium">
                <span>Strict / Logical</span>
                <span>Balanced</span>
                <span>Creative / Wild</span>
            </div>
            {localSettings.enableThinking && (
                <p className="text-xs text-purple-400 mt-1">
                    *Response style is automated when Thinking Mode is active.
                </p>
            )}
          </div>

          {/* Features Toggles */}
          <div className="space-y-4 pt-4 border-t border-white/5">
            {/* Web Search - Only for Gemini usually, but allowed check for now */}
            {localSettings.provider === 'gemini' && (
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition">
                <div className="flex flex-col">
                    <span className="text-sm font-medium text-white flex items-center gap-2">
                    <Search size={16} className="text-green-400" /> Web Grounding
                    </span>
                    <span className="text-xs text-slate-400">Connect to real-time internet data</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                    type="checkbox" 
                    checked={localSettings.enableWebSearch}
                    onChange={(e) => setLocalSettings({...localSettings, enableWebSearch: e.target.checked})}
                    className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500 shadow-inner"></div>
                </label>
                </div>
            )}

            {/* Thinking Mode */}
            <div className="flex flex-col gap-3 p-3 rounded-xl bg-purple-900/10 border border-purple-500/20 hover:bg-purple-900/20 transition">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                    <span className="text-sm font-medium text-white flex items-center gap-2">
                    <Brain size={16} className="text-purple-400" /> Deep Thinking
                    </span>
                    <span className="text-xs text-slate-400">Chain-of-thought reasoning</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                    type="checkbox" 
                    checked={localSettings.enableThinking}
                    onChange={(e) => setLocalSettings({...localSettings, enableThinking: e.target.checked})}
                    className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600 shadow-inner"></div>
                </label>
              </div>
              
               {/* Thinking Budget */}
               {localSettings.enableThinking && localSettings.provider === 'gemini' && (
                   <div className="pl-2 pr-2 pb-1 space-y-2 animate-in slide-in-from-top-2">
                      <div className="flex justify-between items-center">
                         <label className="text-[10px] text-purple-300 uppercase font-bold">Token Budget</label>
                         <span className="text-[10px] text-white bg-purple-600 px-2 py-0.5 rounded-full">{localSettings.thinkingBudget || 'Auto'}</span>
                      </div>
                      <input 
                          type="range" 
                          min="0" 
                          max="8000" 
                          step="1024"
                          value={localSettings.thinkingBudget} 
                          onChange={(e) => setLocalSettings({...localSettings, thinkingBudget: parseInt(e.target.value)})}
                          className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-400"
                      />
                   </div>
              )}
            </div>
          </div>

          {/* System Prompt */}
           <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Persona / Instructions</label>
            <textarea
              value={localSettings.systemInstruction || ''}
              onChange={(e) => setLocalSettings({ ...localSettings, systemInstruction: e.target.value })}
              className="w-full bg-slate-800/50 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-neonBlue outline-none h-24 resize-none transition-colors"
              placeholder="E.g. You are a sarcastic pirate..."
            />
          </div>

        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/5 flex justify-end bg-white/5">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-8 py-3 rounded-xl font-medium transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:scale-105 active:scale-95"
          >
            <Save size={18} /> Apply Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
