import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { GroundShadow, PlacedSparkle } from "../components/Decorations";
import { HandUnderline } from "../components/HandUnderline";
import { PaperBackground } from "../components/PaperBackground";
import { PointChip } from "../components/PointChip";
import { PlacedRobot, robotScreen, type Eyes } from "../components/Robot";
import { SpeechBubble } from "../components/SpeechBubble";
import { StickerText } from "../components/StickerText";
import { C, FONT_BODY } from "../theme";
import { clamp, softSpring } from "../utils/motion";
import { plainTitle, textWidth } from "../utils/title";
import { DEFAULT_INTENSITY, type OpeningProps } from "./types";

// 开场 C（5 秒）：为降低 2 秒跳出率设计
// 第 0 帧就是完整标题（首帧即封面）；0.4 秒给出钩子；1.2~2 秒弹出要点；之后约每秒一个小变化
export const OPENING_C_FRAMES = 150;

const BOX = { left: 120, width: 1250 };
const ROBOT = { cx: 1620, bottom: 990, scale: 1.45 };
const SCREEN = robotScreen(ROBOT);
const EXIT_START = 124;
const DOT_COLORS = [C.green, C.purple, C.yellow];

export const OpeningC: React.FC<OpeningProps> = ({
  no,
  titleLines,
  channelName,
  hook = "",
  points = [],
  greeting = "跟我来！",
  intensity = DEFAULT_INTENSITY,
}) => {
  const K = intensity;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sp = (start: number, damping = 10) => softSpring(frame, fps, start, K, { damping });

  // 时间线（帧，30fps）
  const settle = interpolate(frame, [0, 8], [1.05, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const underline = interpolate(frame, [2, 14], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const hookIn = sp(12); // 0.4 秒
  const pointIn = points.map((_, i) => sp(36 + i * 12)); // 1.2 / 1.6 / 2.0 秒
  const bubble = sp(72, 9) * interpolate(frame, [EXIT_START - 6, EXIT_START], [1, 0], clamp);

  const calm = 1 - interpolate(frame, [EXIT_START - 8, EXIT_START], [0, 1], clamp);
  const bob = Math.sin(frame / 7) * 8 * K;
  const tilt = (-6 + Math.sin(frame / 11) * 3 * K) * calm;
  let eyes: Eyes = "star";
  if (frame >= 20) eyes = "ring";
  if ((frame >= 32 && frame < 36) || (frame >= 96 && frame < 100)) eyes = "blink";
  if (frame >= 72 && frame < 96) eyes = "happy";
  if (frame >= EXIT_START) eyes = "star";

  const exitP = interpolate(frame, [EXIT_START, OPENING_C_FRAMES], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  const camScale = interpolate(exitP, [0, 1], [1, 18]);

  const sizes = titleLines.map((l, i) => Math.min(i === 0 && titleLines.length > 1 ? 250 : 180, BOX.width / textWidth(plainTitle(l))));
  let y = 150;

  return (
    <AbsoluteFill style={{ backgroundColor: C.ink }}>
      <AbsoluteFill style={{ transformOrigin: `${SCREEN.cx}px ${SCREEN.cy}px`, transform: `scale(${camScale})` }}>
        <PaperBackground />

        {/* 期数 + 账号 */}
        <div
          style={{
            position: "absolute",
            left: BOX.left,
            top: 62,
            display: "flex",
            gap: 16,
            alignItems: "center",
            fontFamily: FONT_BODY,
            fontWeight: 900,
            fontSize: 40,
            color: C.ink,
          }}
        >
          <span style={{ background: C.ink, color: C.white, padding: "4px 22px", borderRadius: 999 }}>第 {no} 期</span>
          <span>{channelName}</span>
        </div>

        {/* 标题：首帧即完整 */}
        <div style={{ position: "absolute", left: 0, top: 0, transformOrigin: `${BOX.left}px 300px`, transform: `scale(${settle})` }}>
          {titleLines.map((line, li) => {
            const fs = sizes[li];
            const top = y;
            y += fs * 1.08 + 10;
            return (
              <StickerText
                key={li}
                text={line}
                fontSize={fs}
                style={{
                  position: "absolute",
                  left: BOX.left,
                  top,
                  transformOrigin: "0% 50%",
                  transform: `rotate(${-1.5 + Math.sin((frame + li * 30) / 13) * 1.2 * K}deg)`,
                }}
              />
            );
          })}
          <HandUnderline x={BOX.left + 10} y={y} width={990} progress={underline} thickness={20} />
        </div>

        {/* 钩子贴纸 */}
        {hook ? (
          <div
            style={{
              position: "absolute",
              left: BOX.left,
              top: 690,
              transformOrigin: "0% 50%",
              transform: `scale(${hookIn}) rotate(${-2 + (1 - hookIn) * -8}deg)`,
              background: C.white,
              border: `6px solid ${C.ink}`,
              borderRadius: 22,
              boxShadow: `8px 8px 0 ${C.ink}`,
              padding: "10px 34px",
              fontFamily: FONT_BODY,
              fontWeight: 900,
              fontSize: 64,
              color: C.ink,
              whiteSpace: "nowrap",
            }}
          >
            {hook}
          </div>
        ) : null}

        {/* 要点 */}
        <div style={{ position: "absolute", left: BOX.left, top: 860, display: "flex", gap: 22 }}>
          {points.slice(0, 3).map((p, i) => (
            <PointChip
              key={i}
              index={i + 1}
              text={p}
              dotColor={DOT_COLORS[i % 3]}
              style={{ transform: `translateY(${(1 - pointIn[i]) * 60}px) scale(${pointIn[i]})`, opacity: Math.min(1, pointIn[i] * 2) }}
            />
          ))}
        </div>

        {[
          { x: 1500, y: 170, s: 70, c: C.yellow, d: 6 },
          { x: 1820, y: 420, s: 50, c: C.green, d: 54 },
          { x: 1180, y: 120, s: 46, c: C.purple, d: 84 },
        ].map((p, i) => (
          <PlacedSparkle key={i} x={p.x} y={p.y} size={p.s} color={p.c} scale={sp(p.d, 8) * (0.92 + Math.sin(frame / 8 + i) * 0.08)} />
        ))}

        <GroundShadow cx={ROBOT.cx} y={ROBOT.bottom - 10} width={340} opacity={0.16} scaleX={1 - bob / 80} />
        <PlacedRobot
          {...ROBOT}
          offsetY={bob}
          rotate={tilt}
          eyes={eyes}
          handleAngle={Math.sin(frame / 5) * 8 * K}
          showLines={frame % 30 < 14}
          mouthWidth={eyes === "happy" ? 60 : 40}
        />
        <SpeechBubble x={ROBOT.cx - 360} y={ROBOT.bottom - 590} scale={bubble} rotate={5 + Math.sin(frame / 6) * 2 * K} fontSize={56}>
          {greeting}
        </SpeechBubble>
      </AbsoluteFill>
      <AbsoluteFill style={{ backgroundColor: C.screen, opacity: interpolate(frame, [140, 149], [0, 1], clamp) }} />
    </AbsoluteFill>
  );
};
