import React from "react";
import { C } from "../theme";

export type Eyes = "ring" | "blink" | "happy" | "star" | "none";

const EYE: Record<Eyes, [number, number][]> = {
  ring: [[1, 0], [2, 0], [0, 1], [3, 1], [0, 2], [3, 2], [1, 3], [2, 3]],
  blink: [[0, 2], [1, 2], [2, 2], [3, 2]],
  happy: [[1, 0], [2, 0], [0, 1], [3, 1], [0, 2], [3, 2]],
  star: [[1, 0], [2, 0], [0, 1], [1, 1], [2, 1], [3, 1], [1, 2], [2, 2], [0, 3], [3, 3]],
  none: [],
};

const Pixels: React.FC<{ ox: number; oy: number; cells: [number, number][] }> = ({ ox, oy, cells }) => (
  <>
    {cells.map(([x, y], i) => (
      <rect key={i} x={ox + x * 14} y={oy + y * 14} width={13} height={13} fill={C.green} />
    ))}
  </>
);

// 吉祥物：紫色机器盒（340x320）。eyes 控制表情，handleAngle 控制提手摆动角度，showLines 显示两侧的动感线
export const Robot: React.FC<{
  eyes?: Eyes;
  handleAngle?: number;
  showLines?: boolean;
  mouthWidth?: number;
}> = ({ eyes = "ring", handleAngle = 0, showLines = true, mouthWidth = 40 }) => (
  <svg width={340} height={320} viewBox="0 0 340 320" style={{ overflow: "visible" }}>
    <g stroke={C.ink} strokeWidth={7} strokeLinejoin="round" strokeLinecap="round">
      <g transform={`rotate(${handleAngle} 170 92)`}>
        <path d="M95 92 Q95 30 170 30 Q245 30 245 92" fill="none" strokeWidth={22} />
        <path d="M95 92 Q95 30 170 30 Q245 30 245 92" fill="none" stroke={C.purple} strokeWidth={10} />
      </g>
      <rect x={40} y={90} width={260} height={200} rx={26} fill={C.purple} />
      <rect x={40} y={245} width={260} height={45} fill={C.purpleDark} />
      <rect x={72} y={115} width={196} height={120} rx={18} fill={C.screen} />
      <rect x={58} y={252} width={28} height={22} rx={4} fill={C.pink} />
      <rect x={254} y={252} width={28} height={22} rx={4} fill={C.yellow} />
    </g>
    <Pixels ox={108} oy={140} cells={EYE[eyes]} />
    <Pixels ox={178} oy={140} cells={EYE[eyes]} />
    {eyes === "none" ? null : <rect x={170 - mouthWidth / 2} y={205} width={mouthWidth} height={10} fill={C.green} />}
    {showLines ? (
      <path
        d="M20 80 l16 -16 M14 112 l22 -4 M318 70 l-16 -14 M326 108 l-22 -2"
        stroke={C.ink}
        strokeWidth={6}
        strokeLinecap="round"
      />
    ) : null}
  </svg>
);

export type RobotProps = React.ComponentProps<typeof Robot>;

// 机器人在画面中的摆放：以脚底中点 (cx, bottom) 为锚点
export type RobotPlacement = { cx: number; bottom: number; scale: number };

// 屏幕在画面中的位置（用于镜头推进、往屏幕里放字）
export const robotScreen = ({ cx, bottom, scale }: RobotPlacement) => {
  const x = cx - 170 * scale + 72 * scale;
  const y = bottom - 320 * scale + 115 * scale;
  const w = 196 * scale;
  const h = 120 * scale;
  return { x, y, w, h, cx: x + w / 2, cy: y + h / 2 };
};

// 摆好位置的机器人。offsetY 上下位移，rotate 旋转，squash 正数拉长、负数压扁
export const PlacedRobot: React.FC<
  RobotPlacement & RobotProps & { offsetY?: number; rotate?: number; squash?: number; children?: React.ReactNode }
> = ({ cx, bottom, scale, offsetY = 0, rotate = 0, squash = 0, children, ...robot }) => (
  <div
    style={{
      position: "absolute",
      left: cx - 170,
      top: bottom - 320 + offsetY,
      width: 340,
      height: 320,
      transformOrigin: "50% 100%",
      transform: `scale(${scale}) rotate(${rotate}deg) scaleY(${1 + squash}) scaleX(${1 - squash * 0.6})`,
    }}
  >
    {children ?? <Robot {...robot} />}
  </div>
);
