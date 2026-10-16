import React from "react";
import { C } from "../theme";
import { Sparkle } from "./Sparkle";

// 彩色圆点贴纸
export const FloatingDot: React.FC<{ x: number; y: number; r: number; color: string; scale: number; offsetY?: number }> = ({
  x,
  y,
  r,
  color,
  scale,
  offsetY = 0,
}) => (
  <div
    style={{
      position: "absolute",
      left: x - r,
      top: y - r + offsetY,
      width: r * 2,
      height: r * 2,
      borderRadius: "50%",
      background: color,
      border: `5px solid ${C.ink}`,
      transform: `scale(${scale})`,
    }}
  />
);

// 放在 (x, y) 的星星，scale 控制弹出，rotate 控制旋转
export const PlacedSparkle: React.FC<{ x: number; y: number; size: number; color: string; scale: number; rotate?: number }> = ({
  x,
  y,
  size,
  color,
  scale,
  rotate = 0,
}) => (
  <div style={{ position: "absolute", left: x - size / 2, top: y - size / 2, transform: `scale(${scale}) rotate(${rotate}deg)` }}>
    <Sparkle size={size} color={color} />
  </div>
);

// 机器人脚下的地面阴影
export const GroundShadow: React.FC<{ cx: number; y: number; width: number; opacity: number; scaleX?: number }> = ({
  cx,
  y,
  width,
  opacity,
  scaleX = 1,
}) => (
  <div
    style={{
      position: "absolute",
      left: cx - width / 2,
      top: y,
      width,
      height: width * 0.1,
      borderRadius: "50%",
      background: C.ink,
      opacity,
      transform: `scaleX(${scaleX})`,
    }}
  />
);
