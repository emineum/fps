
export const MOVEMENT_CONFIG = {
  // 발로란트 기준 속도 (m/s 근사치)
  RUN_SPEED: 5.4, 
  WALK_SPEED: 2.97, // 약 55%
  CROUCH_SPEED: 2.1, // 약 40%
  
  JUMP_FORCE: 4.8,
  GRAVITY: 18, // 발로란트는 약간 무거운 중력감을 가짐
  AIR_CONTROL: 0.15, // 공중 제어는 매우 제한적임
  
  FOV_NORMAL: 103, // 발로란트 기본 FOV
  FOV_ADS: 85,    // 정밀 조준 시 FOV (발로란트는 무기마다 다르지만 보통 0.9x ~ 1.15x 줌)
  
  EYE_LEVEL: 1.6,
  CROUCH_EYE_LEVEL: 1.0,
  MOUSE_SENSITIVITY: 0.002,
  
  // Landing Penalty Config (발로란트 특유의 착지 후 경직)
  LANDING_SLOW_FACTOR: 0.45, // 착지 시 속도가 45%로 대폭 감소
  LANDING_RECOVERY_TIME: 0.4, // 회복까지 걸리는 시간
};

export const MAP_CONFIG = {
  SIZE: 50,
  PLAYABLE_RADIUS: 24,
  WALL_HEIGHT: 8,
};

export const INITIAL_SKILLS = [
  {
    id: 'c-skill',
    name: 'Barrier',
    key: 'C',
    maxCharges: 2,
    currentCharges: 2,
    description: '장벽을 생성하여 시야를 차단합니다.',
    color: '#34d399',
  },
  {
    id: 'q-skill',
    name: 'Flash',
    key: 'Q',
    maxCharges: 2,
    currentCharges: 2,
    description: '빛의 구체를 던져 적의 시야를 멀게 합니다.',
    color: '#fbbf24',
  },
  {
    id: 'e-skill',
    name: 'Dash',
    key: 'E',
    maxCharges: 1,
    currentCharges: 1,
    description: '이동 방향으로 빠르게 대시합니다.',
    color: '#60a5fa',
  },
  {
    id: 'x-skill',
    name: 'Ultimate',
    key: 'X',
    maxCharges: 1,
    currentCharges: 1,
    description: '강력한 궁극기를 사용합니다.',
    color: '#d946ef',
  },
];
