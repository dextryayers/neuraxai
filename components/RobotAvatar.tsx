import React from 'react';
import { RobotEmotion } from '../types';

interface RobotAvatarProps {
  emotion: RobotEmotion;
  size?: 'xs' | 'sm' | 'md' | 'lg';
}

const RobotAvatar: React.FC<RobotAvatarProps> = ({ emotion, size = 'md' }) => {
  const sizeClasses = {
    xs: 'w-6 h-6',     // Slightly larger status icon (24px)
    sm: 'w-9 h-9',     // Sidebar logo size (36px)
    md: 'w-16 h-16',   // Standard chat bubble size
    lg: 'w-24 h-24'    // Main screen mascot size
  };

  // Eye configuration based on emotion
  const getEyeConfig = () => {
    switch (emotion) {
      case 'happy':
        return {
          shape: 'h-full rounded-full scale-y-[0.6]', // Squinty smile
          color: 'text-neonBlue bg-neonBlue',
          container: 'rotate-0',
          leftTransform: 'rotate-[-15deg]',
          rightTransform: 'rotate-[15deg]',
          blink: false
        };
      case 'sad':
        return {
          shape: 'h-full rounded-full scale-y-[0.7]',
          color: 'text-red-500 bg-red-500',
          container: 'translate-y-2',
          leftTransform: 'rotate-[20deg]',
          rightTransform: 'rotate-[-20deg]',
          blink: false
        };
      case 'thinking':
        return {
          shape: 'h-full rounded-full',
          color: 'text-purple-400 bg-purple-400',
          container: '',
          leftTransform: 'animate-pulse',
          rightTransform: 'animate-pulse delay-75',
          blink: false
        };
      case 'listening':
        return {
            shape: 'h-full rounded-full scale-110',
            color: 'text-green-400 bg-green-400',
            container: '',
            leftTransform: '',
            rightTransform: '',
            blink: true
        };
      default: // idle
        return {
          shape: 'h-full rounded-full', // Standard oval
          color: 'text-neonBlue bg-neonBlue',
          container: '',
          leftTransform: '',
          rightTransform: '',
          blink: true
        };
    }
  };

  const config = getEyeConfig();
  const containerAnim = emotion === 'thinking' ? 'animate-bounce' : 'animate-float';
  
  // Mouth configuration
  const mouthHeight = emotion === 'happy' ? 'h-[15%]' : 'h-[5%]';

  // Check if size is extra small for minor detail reduction (e.g. glare/scanlines)
  // But keep ears/antenna for silhouette consistency
  const isXS = size === 'xs';

  return (
    <div className={`relative ${sizeClasses[size]} flex items-center justify-center robot-container ${containerAnim} select-none`}>
        
        {/* Antenna (Top) */}
        <div className="absolute -top-[15%] w-[6%] h-[20%] bg-slate-600 rounded-t-full z-0 flex items-end justify-center">
             <div className={`w-[200%] h-[50%] rounded-full -mt-[50%] ${emotion === 'thinking' || emotion === 'listening' ? 'bg-red-500 animate-ping' : 'bg-slate-400'}`}></div>
        </div>

        {/* Head Casing */}
        <div className={`relative w-full h-[85%] bg-slate-200 rounded-[25%] p-[4%] shadow-[inset_0_-5px_10px_rgba(0,0,0,0.3)] z-10 border border-slate-400`}>
            
            {/* Dark Inner Face Screen */}
            <div className="w-full h-full bg-[#0a0a0a] rounded-[22%] relative overflow-hidden flex items-center justify-center border-[2px] border-slate-800 shadow-inner">
                
                {/* Scanlines Effect (Visible on SM+) */}
                {!isXS && <div className="absolute inset-0 face-scanlines opacity-20 pointer-events-none animate-scanline z-20"></div>}
                
                {/* Screen Glare */}
                <div className="absolute top-0 right-0 w-[60%] h-[40%] bg-gradient-to-bl from-white/10 to-transparent rounded-tr-[1.5rem] z-30 pointer-events-none"></div>

                {/* Eyes Container */}
                <div className={`flex gap-[15%] items-center justify-center w-full h-[40%] transition-transform duration-500 ${config.container} z-10`}>
                    
                    {/* Left Eye */}
                    <div className={`relative w-[22%] h-full ${config.blink ? 'animate-blink' : ''}`}>
                         <div className={`w-full ${config.shape} ${config.color} robot-eye shadow-[0_0_20px_currentColor] transition-all duration-500 ${config.leftTransform}`}></div>
                         {/* Pupil reflection */}
                         <div className="absolute top-[20%] right-[20%] w-[25%] h-[25%] bg-white/80 rounded-full blur-[0.5px]"></div>
                    </div>

                    {/* Right Eye */}
                    <div className={`relative w-[22%] h-full ${config.blink ? 'animate-blink' : ''}`}>
                         <div className={`w-full ${config.shape} ${config.color} robot-eye shadow-[0_0_20px_currentColor] transition-all duration-500 ${config.rightTransform}`}></div>
                         {/* Pupil reflection */}
                         <div className="absolute top-[20%] right-[20%] w-[25%] h-[25%] bg-white/80 rounded-full blur-[0.5px]"></div>
                    </div>

                </div>

                {/* Digital Mouth / Status Line */}
                <div className={`absolute bottom-[20%] w-[40%] ${mouthHeight} transition-all duration-300 flex items-center justify-center`}>
                     {emotion === 'listening' || emotion === 'thinking' ? (
                         <div className="flex gap-1 h-full items-center bg-slate-800/50 rounded-full px-2">
                            <div className={`w-1 h-1 rounded-full ${config.color} animate-bounce`}></div>
                            <div className={`w-1 h-1 rounded-full ${config.color} animate-bounce delay-75`}></div>
                            <div className={`w-1 h-1 rounded-full ${config.color} animate-bounce delay-150`}></div>
                         </div>
                     ) : emotion === 'happy' ? (
                         // :D Smile
                         <div className="w-full h-full bg-neonBlue rounded-b-full shadow-[0_0_10px_#00f3ff]"></div>
                     ) : (
                         // Neutral Line
                         <div className="w-full h-[5px] bg-slate-800/50 rounded-full overflow-hidden">
                             <div className="h-full w-full bg-slate-700/50"></div>
                         </div>
                     )}
                </div>

            </div>
        </div>

        {/* Ear Bolts (ALWAYS VISIBLE NOW for silhouette consistency) */}
        <div className="absolute -left-[5%] w-[8%] h-[25%] bg-slate-300 rounded-l-lg border-r border-slate-400 shadow-lg top-[35%]"></div>
        <div className="absolute -right-[5%] w-[8%] h-[25%] bg-slate-300 rounded-r-lg border-l border-slate-400 shadow-lg top-[35%]"></div>

    </div>
  );
};

export default RobotAvatar;