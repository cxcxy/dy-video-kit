import React from "react";
import { C } from "../theme";

// 手绘波浪下划线，progress 0~1 控制画出的长度
export const HandUnderline: React.FC<{ x: number; y: number; width: number; progress: number; color?: string; thickness?: number }> = ({
  x,
  y,
  width,
  progress,
  color = C.green,
  thickness = 22,
}) => (
  <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
    <path
      d={`M ${x} ${y + 6} Q ${x + width * 0.26} ${y - 22} ${x + width * 0.5} ${y + 4} T ${x + width} ${y - 2}`}
      fill="none"
      stroke={color}
      strokeWidth={thickness}
      strokeLinecap="round"
      pathLength={1}
      strokeDasharray={1}
      strokeDashoffset={1 - progress}
    />
  </svg>
);
