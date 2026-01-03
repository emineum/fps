
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { PointerLockControls } from '@react-three/drei';
import * as THREE from 'this';
import Scene from './components/Scene';
import HUD from './components/HUD';
import PlayerController from './components/PlayerController';
import { INITIAL_SKILLS, MOVEMENT_CONFIG } from './constants';
import { Skill } from './types';

const App: React.FC = () => {
  const [isLocked, setIsLocked] = useState(false);
  const [skills, setSkills] = useState<Skill[]>(INITIAL_SKILLS);
  const [isADS, setIsADS] = useState(false);
  
  const handleSkillUse = useCallback((key: string) => {
    setSkills(prev => prev.map(s => {
      if (s.key === key && s.currentCharges > 0) {
        console.log(`Using skill: ${s.name}`);
        // Simple visual feedback could be added here
        return { ...s, currentCharges: s.currentCharges - 1 };
      }
      return s;
    }));
  }, []);

  const handlePointerLock = useCallback(() => {
    // This will be triggered by the HUD button
    const element = document.body;
    element.requestPointerLock();
  }, []);

  useEffect(() => {
    const onLockChange = () => {
      setIsLocked(!!document.pointerLockElement);
    };
    document.addEventListener('pointerlockchange', onLockChange);
    return () => document.removeEventListener('pointerlockchange', onLockChange);
  }, []);

  return (
    <div className="w-full h-full bg-slate-100">
      <Canvas 
        shadows 
        camera={{ 
          fov: isADS ? MOVEMENT_CONFIG.FOV_ADS : MOVEMENT_CONFIG.FOV_NORMAL, 
          position: [0, MOVEMENT_CONFIG.EYE_LEVEL, 0] 
        }}
      >
        <Scene />
        
        {isLocked && (
          <PlayerController 
            onSkillUse={handleSkillUse} 
            isADS={isADS} 
            setIsADS={setIsADS} 
          />
        )}
        
        <PointerLockControls />
      </Canvas>

      <HUD 
        skills={skills} 
        isLocked={isLocked} 
        onUnlock={handlePointerLock}
        isADS={isADS}
      />
      
      {/* 16:9 Aspect Ratio Mask / Guide */}
      <div className="fixed inset-0 pointer-events-none border-[1px] border-white/5 box-border"></div>
    </div>
  );
};

export default App;
