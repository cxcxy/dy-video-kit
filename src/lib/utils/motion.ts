import { spring } from "remotion";

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// 带"力度"的弹簧：intensity 越小越稳（阻尼越大、回弹越少）
// intensity = 1 原始力度；0.56 = 目前定下的轻量版
export const softSpring = (
  frame: number,
  fps: number,
  start: number,
  intensity: number,
  { damping = 10, stiffness = 150, mass = 1 } = {},
) => spring({ frame: frame - start, fps, config: { damping: damping / intensity, stiffness, mass } });

// 用前后两帧的差估算速度，驱动挤压/拉伸
export const squashFromVelocity = (cur: number, prev: number, intensity: number, gain = 1.1) =>
  Math.max(-0.22, Math.min(0.28, (cur - prev) * gain)) * intensity;
