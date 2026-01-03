
import React from 'react';
import { Skill } from '../types';

interface HUDProps {
  skills: Skill[];
  isLocked: boolean;
  onUnlock: () => void;
  isADS: boolean;
}

const HUD: React.FC<HUDProps> = ({ skills, isLocked, onUnlock, isADS }) => {
  return (
    <div className="fixed inset-0 pointer-events-none flex flex-col justify-between p-8 select-none">
      {/* Top Banner */}
      {!isLocked && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
           <button 
             onClick={onUnlock}
             className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded font-bold text-xl shadow-2xl transition-all uppercase tracking-widest"
           >
             Click to Start (Pointer Lock)
           </button>
        </div>
      )}

      <div className="flex justify-between items-start">
        <div className="bg-black/40 backdrop-blur-sm p-4 rounded border-l-4 border-red-500">
          <h1 className="text-white font-bold text-lg">TACTICAL FPS DEMO</h1>
          <p className="text-gray-300 text-xs">VALORANT-LIKE CONTROLLER</p>
        </div>
        <div className="text-right">
          <div className="text-white font-mono text-4xl font-black italic">100 HP</div>
          <div className="w-48 h-2 bg-gray-800 mt-1 rounded-full overflow-hidden">
            <div className="w-full h-full bg-red-500"></div>
          </div>
        </div>
      </div>

      {/* Crosshair */}
      {!isADS && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
            <div className="absolute w-0.5 h-0.5 bg-white -translate-x-[2px]"></div>
            <div className="absolute w-0.5 h-0.5 bg-white translate-x-[2px]"></div>
            <div className="absolute h-0.5 w-0.5 bg-white -translate-y-[2px]"></div>
            <div className="absolute h-0.5 w-0.5 bg-white translate-y-[2px]"></div>
            <div className="absolute w-0.5 h-0.5 bg-white -translate-x-[2px] -translate-y-[0.5px]"></div>
            <div className="absolute w-0.5 h-0.5 bg-white translate-x-[2px] -translate-y-[0.5px]"></div>
        </div>
      )}

      {/* ADS Indicator */}
      {isADS && (
        <div className="absolute inset-0 border-[80px] border-black/20 flex items-center justify-center">
          <div className="w-[1px] h-screen bg-red-500/20"></div>
          <div className="h-[1px] w-screen bg-red-500/20 absolute"></div>
          <div className="w-2 h-2 bg-red-600 rounded-full"></div>
        </div>
      )}

      {/* Skills Bottom HUD */}
      <div className="flex justify-center items-end gap-6 pb-4">
        {skills.map((skill) => {
          const isUlt = skill.key === 'X';
          return (
            <div key={skill.id} className={`flex flex-col items-center gap-2 group transition-all ${isUlt ? 'scale-110 mb-1' : ''}`}>
              <div className={`text-white text-[10px] font-bold px-2 py-0.5 rounded border ${isUlt ? 'bg-fuchsia-900/80 border-fuchsia-400 animate-pulse' : 'bg-black/60 border-white/20'}`}>
                {skill.key}
              </div>
              <div 
                className={`rounded border-2 flex items-center justify-center bg-black/60 transition-all ${
                  isUlt ? 'w-16 h-16' : 'w-14 h-14'
                } ${
                  skill.currentCharges > 0 ? 'border-white' : 'border-gray-700 opacity-50'
                }`}
                style={{ 
                  boxShadow: skill.currentCharges > 0 ? `0 0 20px ${skill.color}55` : 'none',
                  borderColor: skill.currentCharges > 0 ? skill.color : '#374151'
                }}
              >
                <div className="text-white font-bold text-xl uppercase italic tracking-tighter" style={{ color: skill.color }}>
                  {skill.name[0]}
                </div>
              </div>
              <div className="flex gap-1">
                {Array.from({ length: skill.maxCharges }).map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-1 rounded-full transition-all ${
                        isUlt ? 'w-16' : 'w-4'
                    } ${
                        i < skill.currentCharges 
                            ? 'bg-white shadow-[0_0_8px_white]' 
                            : 'bg-gray-700'
                    }`}
                    style={{ backgroundColor: i < skill.currentCharges ? skill.color : undefined }}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Controls Help */}
      <div className="absolute bottom-8 left-8 text-gray-400 text-[10px] space-y-1">
        <p>WASD: 이동</p>
        <p>SHIFT: 걷기 | CTRL: 앉기 | SPACE: 점프</p>
        <p>MOUSE LEFT: 사격 | MOUSE RIGHT: 정밀조준</p>
        <p>Q, E, C, X: 스킬 사용</p>
      </div>
    </div>
  );
};

export default HUD;
