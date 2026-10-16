import React from "react";
import { C, FONT_BODY } from "../theme";

// 白底粗描边对话气泡。scale 控制弹出（0~1），rotate 为角度
export const SpeechBubble: React.FC<{
  children: React.ReactNode;
  x: number;
  y: number;
  scale: number;
  rotate?: number;
  fontSize?: number;
  origin?: string;
}> = ({ children, x, y, scale, rotate = 0, fontSize = 60, origin = "100% 100%" }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      transformOrigin: origin,
      transform: `scale(${scale}) rotate(${rotate}deg)`,
      background: C.white,
      border: `6px solid ${C.ink}`,
      borderRadius: 28,
      padding: "4px 30px",
      fontFamily: FONT_BODY,
      fontWeight: 900,
      fontSize,
      color: C.ink,
      boxShadow: `6px 6px 0 ${C.ink}`,
      whiteSpace: "nowrap",
    }}
  >
    {children}
  </div>
);
