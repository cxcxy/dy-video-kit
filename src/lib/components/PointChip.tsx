import React from "react";
import { C, FONT_BODY } from "../theme";

// 带序号圆点的要点胶囊：① 它是什么
export const PointChip: React.FC<{ index: number; text: string; dotColor: string; fontSize?: number; style?: React.CSSProperties }> = ({
  index,
  text,
  dotColor,
  fontSize = 42,
  style,
}) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 12,
      background: C.ink,
      color: C.white,
      borderRadius: 999,
      padding: "10px 30px 10px 12px",
      fontFamily: FONT_BODY,
      fontWeight: 900,
      fontSize,
      ...style,
    }}
  >
    <span
      style={{
        width: fontSize * 1.3,
        height: fontSize * 1.3,
        borderRadius: "50%",
        background: dotColor,
        color: dotColor === C.purple ? C.white : C.ink,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: fontSize * 0.76,
      }}
    >
      {index}
    </span>
    {text}
  </div>
);
