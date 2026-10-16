import React from "react";
import { C } from "../theme";

// 落地冲击线：以 (x, y) 为中心向上半圈散开。progress 0~1，结束时淡出
export const ImpactLines: React.FC<{ x: number; y: number; progress: number; radius?: number; spread?: number; visible?: boolean }> = ({
  x,
  y,
  progress,
  radius = 300,
  spread = 80,
  visible = true,
}) => (
  <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, opacity: visible ? 1 - progress : 0 }}>
    {new Array(9).fill(0).map((_, i) => {
      const a = Math.PI + (i / 8) * Math.PI;
      const r1 = radius + progress * spread;
      const r2 = r1 + 45 + progress * 35;
      return (
        <line
          key={i}
          x1={x + Math.cos(a) * r1}
          y1={y + Math.sin(a) * r1 * 0.6}
          x2={x + Math.cos(a) * r2}
          y2={y + Math.sin(a) * r2 * 0.6}
          stroke={C.ink}
          strokeWidth={8}
          strokeLinecap="round"
        />
      );
    })}
  </svg>
);
