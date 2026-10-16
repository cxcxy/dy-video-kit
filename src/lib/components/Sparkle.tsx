import React from "react";
import { C } from "../theme";

// 四角星贴纸
export const Sparkle: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="-50 -50 100 100" style={{ overflow: "visible" }}>
    <path
      d="M0 -46 Q8 -8 46 0 Q8 8 0 46 Q-8 8 -46 0 Q-8 -8 0 -46Z"
      fill={color}
      stroke={C.ink}
      strokeWidth={7}
      strokeLinejoin="round"
    />
  </svg>
);
