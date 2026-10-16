import React from "react";
import { C, FONT_BODY } from "../theme";

// 黑色胶囊标签（期数、口号等）。shadowColor 给一个彩色硬投影
export const Pill: React.FC<{
  children: React.ReactNode;
  fontSize?: number;
  shadowColor?: string;
  style?: React.CSSProperties;
}> = ({ children, fontSize = 46, shadowColor, style }) => (
  <div
    style={{
      background: C.ink,
      color: C.white,
      fontFamily: FONT_BODY,
      fontWeight: 900,
      fontSize,
      padding: `${fontSize * 0.2}px ${fontSize * 0.78}px`,
      borderRadius: 999,
      whiteSpace: "nowrap",
      boxShadow: shadowColor ? `6px 6px 0 ${shadowColor}` : undefined,
      ...style,
    }}
  >
    {children}
  </div>
);
