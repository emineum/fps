
export interface Skill {
  id: string;
  name: string;
  key: string;
  maxCharges: number;
  currentCharges: number;
  description: string;
  color: string;
}

export interface PlayerState {
  health: number;
  isCrouching: boolean;
  isWalking: boolean;
  isADS: boolean;
  velocity: { x: number; y: number; z: number };
  position: { x: number; y: number; z: number };
}

export type MovementKeys = {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  jump: boolean;
  walk: boolean;
  crouch: boolean;
};
