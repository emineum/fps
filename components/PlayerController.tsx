
import React, { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { MOVEMENT_CONFIG, MAP_CONFIG } from '../constants';
import { MovementKeys } from '../types';

interface PlayerControllerProps {
  onSkillUse: (key: string) => void;
  isADS: boolean;
  setIsADS: (ads: boolean) => void;
}

const PlayerController: React.FC<PlayerControllerProps> = ({ onSkillUse, isADS, setIsADS }) => {
  const { camera } = useThree();
  const keys = useRef<MovementKeys>({
    forward: false,
    backward: false,
    left: false,
    right: false,
    jump: false,
    walk: false,
    crouch: false,
  });

  const velocity = useRef(new THREE.Vector3());
  const bobbingTimer = useRef(0);
  const currentEyeLevel = useRef(MOVEMENT_CONFIG.EYE_LEVEL);
  const isGrounded = useRef(true);
  
  // Landing Penalty State
  const landingTimer = useRef(0);
  const landingDip = useRef(0);
  const wasInAir = useRef(false);

  // Temporary vectors
  const frontVector = new THREE.Vector3();
  const sideVector = new THREE.Vector3();
  const moveVector = new THREE.Vector3();
  const weaponGroup = useRef<THREE.Group>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k === 'w') keys.current.forward = true;
      if (k === 's') keys.current.backward = true;
      if (k === 'a') keys.current.left = true;
      if (k === 'd') keys.current.right = true;
      if (k === ' ') keys.current.jump = true;
      if (k === 'shift') keys.current.walk = true;
      if (k === 'control') keys.current.crouch = true;
      
      if (['q', 'e', 'c', 'x'].includes(k)) {
        onSkillUse(k.toUpperCase());
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k === 'w') keys.current.forward = false;
      if (k === 's') keys.current.backward = false;
      if (k === 'a') keys.current.left = false;
      if (k === 'd') keys.current.right = false;
      if (k === ' ') keys.current.jump = false;
      if (k === 'shift') keys.current.walk = false;
      if (k === 'control') keys.current.crouch = false;
    };

    const handleMouseDown = (e: MouseEvent) => {
        if (e.button === 0 && weaponGroup.current) {
            weaponGroup.current.position.z += 0.05;
        }
        if (e.button === 2) setIsADS(true);
    };

    const handleMouseUp = (e: MouseEvent) => {
        if (e.button === 2) setIsADS(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [onSkillUse, setIsADS]);

  useFrame((state, delta) => {
    // 1. Calculate Base Speed
    let targetSpeed = MOVEMENT_CONFIG.RUN_SPEED;
    if (keys.current.crouch) targetSpeed = MOVEMENT_CONFIG.CROUCH_SPEED;
    else if (keys.current.walk || isADS) targetSpeed = MOVEMENT_CONFIG.WALK_SPEED;

    // 2. Apply Landing Penalty (Recovery curve)
    if (landingTimer.current > 0) {
      const recoveryProgress = 1 - (landingTimer.current / MOVEMENT_CONFIG.LANDING_RECOVERY_TIME);
      const landingSpeedMultiplier = THREE.MathUtils.lerp(MOVEMENT_CONFIG.LANDING_SLOW_FACTOR, 1.0, recoveryProgress);
      targetSpeed *= landingSpeedMultiplier;
      landingTimer.current = Math.max(0, landingTimer.current - delta);
    }

    landingDip.current = THREE.MathUtils.lerp(landingDip.current, 0, delta * 12);

    // 3. Directional Vectors
    camera.getWorldDirection(frontVector);
    frontVector.y = 0;
    frontVector.normalize();
    sideVector.crossVectors(camera.up, frontVector);
    sideVector.normalize();

    moveVector.set(0, 0, 0);
    if (keys.current.forward) moveVector.add(frontVector);
    if (keys.current.backward) moveVector.sub(frontVector);
    if (keys.current.left) moveVector.add(sideVector);
    if (keys.current.right) moveVector.sub(sideVector);

    if (moveVector.lengthSq() > 0) {
      moveVector.normalize().multiplyScalar(targetSpeed);
    }

    // 4. Movement Execution (Responsive Stop)
    if (isGrounded.current) {
      if (moveVector.lengthSq() > 0) {
        // 즉각적인 반응을 위해 lerp 대신 직접 할당 (발로란트 스타일)
        velocity.current.x = moveVector.x;
        velocity.current.z = moveVector.z;

        // Head Bobbing (발로란트는 이동 시 카메라가 미세하게 위아래로 흔들림)
        const bobFrequency = targetSpeed > MOVEMENT_CONFIG.WALK_SPEED ? 11 : 7;
        const bobAmplitude = targetSpeed > MOVEMENT_CONFIG.WALK_SPEED ? 0.04 : 0.015;
        bobbingTimer.current += delta * bobFrequency;
        const bobY = Math.sin(bobbingTimer.current) * bobAmplitude;
        const bobX = Math.cos(bobbingTimer.current * 0.5) * bobAmplitude * 0.3;
        camera.position.y += bobY;
        camera.position.x += bobX;
        
        if (weaponGroup.current) {
            weaponGroup.current.position.y = THREE.MathUtils.lerp(weaponGroup.current.position.y, bobY * 0.4, 0.15);
            weaponGroup.current.position.x = THREE.MathUtils.lerp(weaponGroup.current.position.x, (isADS ? 0 : 0.35) + bobX, 0.15);
        }
      } else {
        // 즉시 정지
        velocity.current.x = 0;
        velocity.current.z = 0;
      }
    } else {
      // Air Control
      const airAccel = MOVEMENT_CONFIG.AIR_CONTROL;
      if (moveVector.lengthSq() > 0) {
        velocity.current.x += moveVector.x * delta * 5 * airAccel;
        velocity.current.z += moveVector.z * delta * 5 * airAccel;
      }
      // 공중 최대 속도 제한
      const horizontalVelocity = new THREE.Vector2(velocity.current.x, velocity.current.z);
      if (horizontalVelocity.length() > MOVEMENT_CONFIG.RUN_SPEED) {
        horizontalVelocity.normalize().multiplyScalar(MOVEMENT_CONFIG.RUN_SPEED);
        velocity.current.x = horizontalVelocity.x;
        velocity.current.z = horizontalVelocity.y;
      }
    }

    // Gravity and Jumping
    if (isGrounded.current && keys.current.jump) {
      velocity.current.y = MOVEMENT_CONFIG.JUMP_FORCE;
      isGrounded.current = false;
      wasInAir.current = true;
    }
    if (!isGrounded.current) {
      velocity.current.y -= MOVEMENT_CONFIG.GRAVITY * delta;
      wasInAir.current = true;
    }

    // Apply Velocity
    camera.position.x += velocity.current.x * delta;
    camera.position.z += velocity.current.z * delta;
    camera.position.y += velocity.current.y * delta;

    // Bounds
    const playerRadius = 0.6;
    const limit = MAP_CONFIG.PLAYABLE_RADIUS - playerRadius;
    camera.position.x = THREE.MathUtils.clamp(camera.position.x, -limit, limit);
    camera.position.z = THREE.MathUtils.clamp(camera.position.z, -limit, limit);

    // Floor Collision & Landing Logic
    const targetEyeLevel = keys.current.crouch ? MOVEMENT_CONFIG.CROUCH_EYE_LEVEL : MOVEMENT_CONFIG.EYE_LEVEL;
    currentEyeLevel.current = THREE.MathUtils.lerp(currentEyeLevel.current, targetEyeLevel, delta * 12);
    
    if (camera.position.y < currentEyeLevel.current) {
      if (wasInAir.current) {
        // 무거운 착지 느낌을 위해 더 강한 penalty 적용
        landingTimer.current = MOVEMENT_CONFIG.LANDING_RECOVERY_TIME;
        landingDip.current = -0.18; 
        wasInAir.current = false;
      }
      camera.position.y = currentEyeLevel.current + landingDip.current;
      velocity.current.y = 0;
      isGrounded.current = true;
    }

    // Weapon Recovery
    if (weaponGroup.current) {
        const targetX = isADS ? 0 : 0.35;
        const targetY = isADS ? -0.12 : -0.4;
        const targetZ = isADS ? -0.35 : -0.6;
        weaponGroup.current.position.x = THREE.MathUtils.lerp(weaponGroup.current.position.x, targetX, 0.25);
        weaponGroup.current.position.y = THREE.MathUtils.lerp(weaponGroup.current.position.y, targetY + landingDip.current * 0.6, 0.25);
        weaponGroup.current.position.z = THREE.MathUtils.lerp(weaponGroup.current.position.z, targetZ, 0.25);
    }
  });

  return (
    <group ref={weaponGroup} position={[0.35, -0.4, -0.6]}>
        <mesh position={[-0.1, -0.1, 0.3]} rotation={[0.4, 0, 0]}>
            <cylinderGeometry args={[0.06, 0.08, 0.6]} />
            <meshStandardMaterial color="#111" />
        </mesh>
        <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.08, 0.08, 0.12]} />
            <meshStandardMaterial color="#d1a384" />
        </mesh>
        <group position={[0, 0.05, -0.2]}>
            <mesh>
                <boxGeometry args={[0.06, 0.12, 0.5]} />
                <meshStandardMaterial color="#222" metalness={0.8} roughness={0.2} />
            </mesh>
            <mesh position={[0, 0.02, -0.4]}>
                <cylinderGeometry args={[0.015, 0.015, 0.4]} rotation={[Math.PI / 2, 0, 0]} />
                <meshStandardMaterial color="#111" />
            </mesh>
            <mesh position={[0, -0.1, -0.1]} rotation={[0.2, 0, 0]}>
                <boxGeometry args={[0.05, 0.15, 0.04]} />
                <meshStandardMaterial color="#1a1a1a" />
            </mesh>
            <mesh position={[0, 0.08, 0]}>
                <boxGeometry args={[0.03, 0.04, 0.1]} />
                <meshStandardMaterial color="#333" />
            </mesh>
        </group>
    </group>
  );
};

export default PlayerController;
