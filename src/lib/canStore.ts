/**
 * Общий, изменяемый стор состояния банки.
 * GSAP ScrollTrigger пишет в `canTarget` (scrub-твины по секциям),
 * а R3F `useFrame` плавно догоняет эти значения каждый кадр.
 * Так DOM-скролл (Lenis) и 3D-сцена развязаны и не конфликтуют.
 */

export type CanTarget = {
  /** поворот вокруг вертикальной оси (рад) — главное «вращение при скролле» */
  rotY: number;
  /** лёгкий наклон вперёд/назад (рад) */
  rotX: number;
  /** смещение по экрану в долях вьюпорта (-1..1) */
  posX: number;
  posY: number;
  /** масштаб */
  scale: number;
  /** тон тела банки (множитель цвета этикетки) — нота вкуса */
  tint: { r: number; g: number; b: number };
};

export const canTarget: CanTarget = {
  rotY: 0,
  rotX: 0,
  posX: 0,
  posY: 0,
  scale: 1,
  tint: { r: 1, g: 1, b: 1 },
};

/** Положение указателя для микро-параллакса (-0.5..0.5). */
export const pointer = { x: 0, y: 0 };

/** Готовность сцены (для fade-in оверлеев). */
export const sceneState = { ready: false };
