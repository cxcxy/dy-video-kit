import React from "react";
import { C, stickerText } from "../theme";
import { parseTitle } from "../utils/title";

// 一行立体贴纸字。text 里用【】括起来的部分用 hiColor
export const StickerText: React.FC<{
  text: string;
  fontSize: number;
  color?: string;
  hiColor?: string;
  stroke?: number;
  shadow?: number;
  style?: React.CSSProperties;
}> = ({ text, fontSize, color = C.yellow, hiColor = C.purple, stroke = 8, shadow = 10, style }) => (
  <div style={{ fontSize, lineHeight: 1.08, whiteSpace: "nowrap", ...style }}>
    {parseTitle(text).map((sg, k) => (
      <span key={k} style={stickerText(sg.hi ? hiColor : color, stroke, shadow)}>
        {sg.text}
      </span>
    ))}
  </div>
);
