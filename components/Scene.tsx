
import React from 'react';
import * as THREE from 'three';
import { MAP_CONFIG } from '../constants';

const TrainingDummy: React.FC<{ position: [number, number, number], color: string, rotation?: [number, number, number] }> = ({ position, color, rotation = [0, 0, 0] }) => {
  return (
    <group position={position} rotation={rotation}>
      {/* Head */}
      <mesh position={[0, 1.7, 0]} castShadow>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Torso */}
      <mesh position={[0, 1.1, 0]} castShadow>
        <boxGeometry args={[0.5, 0.8, 0.3]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Arms */}
      <mesh position={[0.35, 1.2, 0]} rotation={[0, 0, -0.2]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.7]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[-0.35, 1.2, 0]} rotation={[0, 0, 0.2]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.7]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Legs */}
      <mesh position={[0.15, 0.4, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.1, 0.8]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[-0.15, 0.4, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.1, 0.8]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  );
};

const Scene: React.FC = () => {
  const wallSize = MAP_CONFIG.PLAYABLE_RADIUS * 2;
  
  return (
    <>
      <ambientLight intensity={0.8} />
      <pointLight position={[10, 15, 10]} intensity={2} castShadow />
      <directionalLight 
        position={[-15, 30, 15]} 
        intensity={1.5} 
        castShadow 
        shadow-mapSize={[2048, 2048]} 
      />

      {/* Ground - Changed to a lighter material */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[MAP_CONFIG.SIZE * 4, MAP_CONFIG.SIZE * 4]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.7} metalness={0.1} />
      </mesh>

      {/* Grid helper - Changed to darker colors for contrast on light floor */}
      <gridHelper args={[MAP_CONFIG.SIZE * 4, 80, "#94a3b8", "#cbd5e1"]} position={[0, 0.01, 0]} />

      {/* Arena Boundary Walls */}
      <group>
        {/* North Wall */}
        <mesh position={[0, MAP_CONFIG.WALL_HEIGHT / 2, -MAP_CONFIG.PLAYABLE_RADIUS]} receiveShadow castShadow>
          <boxGeometry args={[wallSize, MAP_CONFIG.WALL_HEIGHT, 1]} />
          <meshStandardMaterial color="#1e293b" metalness={0.6} roughness={0.1} />
        </mesh>
        {/* South Wall */}
        <mesh position={[0, MAP_CONFIG.WALL_HEIGHT / 2, MAP_CONFIG.PLAYABLE_RADIUS]} receiveShadow castShadow>
          <boxGeometry args={[wallSize, MAP_CONFIG.WALL_HEIGHT, 1]} />
          <meshStandardMaterial color="#1e293b" metalness={0.6} roughness={0.1} />
        </mesh>
        {/* East Wall */}
        <mesh position={[MAP_CONFIG.PLAYABLE_RADIUS, MAP_CONFIG.WALL_HEIGHT / 2, 0]} receiveShadow castShadow>
          <boxGeometry args={[1, MAP_CONFIG.WALL_HEIGHT, wallSize]} />
          <meshStandardMaterial color="#1e293b" metalness={0.6} roughness={0.1} />
        </mesh>
        {/* West Wall */}
        <mesh position={[-MAP_CONFIG.PLAYABLE_RADIUS, MAP_CONFIG.WALL_HEIGHT / 2, 0]} receiveShadow castShadow>
          <boxGeometry args={[1, MAP_CONFIG.WALL_HEIGHT, wallSize]} />
          <meshStandardMaterial color="#1e293b" metalness={0.6} roughness={0.1} />
        </mesh>
      </group>

      {/* Boundary visualizer */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[MAP_CONFIG.PLAYABLE_RADIUS - 0.2, MAP_CONFIG.PLAYABLE_RADIUS, 4, 1]} rotation={[0, 0, Math.PI / 4]} />
        <meshBasicMaterial color="#3b82f6" transparent opacity={0.4} />
      </mesh>

      {/* Character Dummies within the map */}
      <TrainingDummy position={[8, 0, 8]} color="#ef4444" rotation={[0, -Math.PI / 4, 0]} />
      <TrainingDummy position={[-12, 0, 5]} color="#3b82f6" rotation={[0, Math.PI / 6, 0]} />
      <TrainingDummy position={[15, 0, -10]} color="#f59e0b" rotation={[0, Math.PI, 0]} />
      <TrainingDummy position={[-5, 0, -15]} color="#d946ef" rotation={[0, Math.PI / 2, 0]} />
      
      {/* Decorative Structures */}
      <mesh position={[0, 2, 0]} castShadow>
        <boxGeometry args={[4, 4, 4]} />
        <meshStandardMaterial color="#334155" />
      </mesh>

      {/* Skybox and Fog - Changed to a bright high-key look */}
      <color attach="background" args={["#f0f9ff"]} />
      <fog attach="fog" args={["#f0f9ff", 10, 100]} />
    </>
  );
};

export default Scene;
