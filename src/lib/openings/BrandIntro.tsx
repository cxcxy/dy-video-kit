import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  random,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { PaperBackground } from "../components/PaperBackground";
import { Robot, type Eyes } from "../components/Robot";
import { Sparkle } from "../components/Sparkle";
import { C, FONT_BODY, stickerText } from "../theme";

// 账号品牌动画（5 秒）：机器人落地 + 账号名逐字弹出 + 口号，可用作片尾关注引导
export const BRAND_INTRO_FRAMES = 150;

export type BrandIntroProps = {
  channelName: string;
  nameHighlight?: number[]; // 账号名里哪几个字用紫色（按位置，从 0 开始）
  slogan: string;
  greeting?: string;
};

// 机器人以底边中点为锚点：cx 为水平中心，bottom 为脚底位置
const ROBOT = { cx: 560, bottom: 860, scale: 1.9 };
const SCREEN = { x: ROBOT.cx, y: ROBOT.bottom - (320 - 175) * ROBOT.scale }; // 镜头最后推进到机器人屏幕
const EXIT_START = 118;

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const BrandIntro: React.FC<BrandIntroProps> = ({ channelName, nameHighlight = [], slogan, greeting = "嗨～" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 1. 圆形转场打开（卡通片的 iris 开场）
  const iris = spring({ frame, fps, config: { damping: 200 }, durationInFrames: 16 });
  const irisR = interpolate(iris, [0, 1], [0, 2300]);

  // 2. 机器人从天而降，速度驱动挤压/拉伸
  const dropCfg = { damping: 9, stiffness: 110, mass: 0.9 };
  const drop = spring({ frame: frame - 4, fps, config: dropCfg });
  const dropPrev = spring({ frame: frame - 5, fps, config: dropCfg });
  const vel = drop - dropPrev;
  const stretch = Math.max(-0.22, Math.min(0.28, vel * 1.1));
  const robotY = interpolate(drop, [0, 1], [-900, 0]);
  const exitP = interpolate(frame, [EXIT_START, BRAND_INTRO_FRAMES], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  const idle = interpolate(frame, [26, 40], [0, 1], clamp) * (1 - interpolate(frame, [EXIT_START - 10, EXIT_START], [0, 1], clamp));
  const bob = Math.sin(frame / 7) * 10 * idle;
  const tilt = Math.sin(frame / 11) * 3.5 * idle;
  const handle = Math.sin(frame / 3.2) * 16 * Math.exp(-Math.max(0, frame - 14) / 18) * (frame > 10 ? 1 : 0);

  // 表情时间线
  let eyes: Eyes = "ring";
  if ((frame >= 40 && frame < 44) || (frame >= 100 && frame < 104)) eyes = "blink";
  if (frame >= 62 && frame < 96) eyes = "happy";
  if (frame >= EXIT_START) eyes = "star";

  // 3. 落地冲击线
  const impact = interpolate(frame, [13, 26], [0, 1], clamp);

  // 4. 账号名逐字弹出
  const chars = Array.from(channelName);

  // 5. 口号胶囊
  const pill = spring({ frame: frame - 54, fps, config: { damping: 11, stiffness: 120 } });

  // 6. 对话气泡
  const bubble = spring({ frame: frame - 62, fps, config: { damping: 9, stiffness: 160 } });
  const bubbleOut = interpolate(frame, [96, 104], [1, 0], clamp);

  // 7. 镜头推进到机器人屏幕
  const camScale = interpolate(exitP, [0, 1], [1, 16]);

  return (
    <AbsoluteFill style={{ backgroundColor: C.ink }}>
      <AbsoluteFill style={{ clipPath: `circle(${irisR}px at ${SCREEN.x}px ${SCREEN.y}px)` }}>
        <AbsoluteFill
          style={{
            transform: `scale(${camScale})`,
            transformOrigin: `${SCREEN.x}px ${SCREEN.y}px`,
          }}
        >
          <PaperBackground />

          {/* 漂浮的彩色圆点贴纸 */}
          {[
            { x: 120, y: 420, r: 26, c: C.green, d: 20 },
            { x: 1780, y: 160, r: 34, c: C.yellow, d: 26 },
            { x: 1700, y: 900, r: 22, c: C.purple, d: 32 },
            { x: 260, y: 930, r: 30, c: C.pink, d: 24 },
            { x: 1200, y: 190, r: 18, c: C.purple, d: 36 },
          ].map((p, i) => {
            const s = spring({ frame: frame - p.d, fps, config: { damping: 8, stiffness: 140 } });
            const fy = Math.sin((frame + i * 20) / 14) * 12;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: p.x - p.r,
                  top: p.y - p.r + fy,
                  width: p.r * 2,
                  height: p.r * 2,
                  borderRadius: "50%",
                  background: p.c,
                  border: `5px solid ${C.ink}`,
                  transform: `scale(${s})`,
                }}
              />
            );
          })}

          {/* 落地冲击线 */}
          <svg width={1920} height={1080} style={{ position: "absolute", opacity: frame < 13 ? 0 : 1 - impact }}>
            {new Array(9).fill(0).map((_, i) => {
              const a = Math.PI + (i / 8) * Math.PI;
              const r1 = 360 + impact * 90;
              const r2 = r1 + 50 + impact * 40;
              const ox = ROBOT.cx;
              const oy = ROBOT.bottom - 40;
              return (
                <line
                  key={i}
                  x1={ox + Math.cos(a) * r1}
                  y1={oy + Math.sin(a) * r1 * 0.6}
                  x2={ox + Math.cos(a) * r2}
                  y2={oy + Math.sin(a) * r2 * 0.6}
                  stroke={C.ink}
                  strokeWidth={9}
                  strokeLinecap="round"
                />
              );
            })}
          </svg>

          {/* 地面阴影 */}
          <div
            style={{
              position: "absolute",
              left: ROBOT.cx - 220,
              top: ROBOT.bottom - 14,
              width: 440,
              height: 44,
              borderRadius: "50%",
              background: C.ink,
              opacity: 0.18 * drop,
              transform: `scaleX(${0.6 + 0.4 * drop - bob / 80})`,
            }}
          />

          {/* 机器人 */}
          <div
            style={{
              position: "absolute",
              left: ROBOT.cx - 170,
              top: ROBOT.bottom - 320 + robotY + bob,
              width: 340,
              height: 320,
              transformOrigin: "50% 100%",
              transform: `scale(${ROBOT.scale}) rotate(${tilt}deg) scaleY(${1 + stretch}) scaleX(${1 - stretch * 0.6})`,
            }}
          >
            <Robot eyes={eyes} handleAngle={handle} showLines={frame > 30 && frame % 16 < 10} mouthWidth={eyes === "happy" ? 64 : 40} />
          </div>

          {/* 对话气泡 */}
          <div
            style={{
              position: "absolute",
              left: ROBOT.cx + 210,
              top: 150,
              transformOrigin: "0% 100%",
              transform: `scale(${bubble * bubbleOut}) rotate(${-6 + Math.sin(frame / 6) * 2}deg)`,
              background: C.white,
              border: `6px solid ${C.ink}`,
              borderRadius: 30,
              padding: "6px 34px",
              fontFamily: FONT_BODY,
              fontWeight: 900,
              fontSize: 72,
              color: C.ink,
              boxShadow: `6px 6px 0 ${C.ink}`,
            }}
          >
            {greeting}
          </div>

          {/* 账号名：逐字弹出的立体贴纸字 */}
          <div style={{ position: "absolute", left: 960, top: 320, display: "flex", alignItems: "flex-end" }}>
            {chars.map((ch, i) => {
              if (ch === " ") return <div key={i} style={{ width: 50 }} />;
              const start = 24 + i * 5;
              const s = spring({ frame: frame - start, fps, config: { damping: 8, stiffness: 170 } });
              const restTilt = (random(`tilt-${i}`) - 0.5) * 12;
              const wobble = Math.sin((frame + i * 9) / 9) * 2.5 * idle;
              const isHi = nameHighlight.includes(i);
              return (
                <div
                  key={i}
                  style={{
                    fontSize: 230,
                    lineHeight: 1,
                    marginRight: 4,
                    ...stickerText(isHi ? C.purple : C.yellow, 8, 10),
                    transform: `translateY(${(1 - s) * 120}px) scale(${s}) rotate(${interpolate(s, [0, 1], [-35, restTilt]) + wobble}deg)`,
                  }}
                >
                  {ch}
                </div>
              );
            })}
          </div>

          {/* 星星贴纸 */}
          {[
            { x: 1010, y: 880, s: 80, c: C.yellow, d: 40 },
            { x: 1800, y: 300, s: 76, c: C.green, d: 46 },
            { x: 1820, y: 820, s: 56, c: C.purple, d: 52 },
            { x: 220, y: 230, s: 64, c: C.yellow, d: 58 },
          ].map((p, i) => {
            const s = spring({ frame: frame - p.d, fps, config: { damping: 7, stiffness: 160 } });
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: p.x - p.s / 2,
                  top: p.y - p.s / 2,
                  transform: `scale(${s}) rotate(${frame * 2 + i * 30}deg)`,
                }}
              >
                <Sparkle size={p.s} color={p.c} />
              </div>
            );
          })}

          {/* 口号胶囊 */}
          <div
            style={{
              position: "absolute",
              left: 970,
              top: 640,
              transform: `translateX(${(1 - pill) * 1100}px) rotate(${-2 + (1 - pill) * 8}deg)`,
              background: C.ink,
              color: C.white,
              fontFamily: FONT_BODY,
              fontWeight: 900,
              fontSize: 58,
              padding: "18px 44px",
              borderRadius: 999,
              whiteSpace: "nowrap",
              boxShadow: `8px 8px 0 ${C.green}`,
            }}
          >
            {slogan}
          </div>
        </AbsoluteFill>
      </AbsoluteFill>
      {/* 推进到屏幕里后渐变成屏幕的深色，方便接正文 */}
      <AbsoluteFill style={{ backgroundColor: C.screen, opacity: interpolate(frame, [136, 148], [0, 1], clamp) }} />
    </AbsoluteFill>
  );
};
