import React from "react";
import { AbsoluteFill, Easing, interpolate, random, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { PaperBackground } from "../components/PaperBackground";
import { FloatingDot, GroundShadow, PlacedSparkle } from "../components/Decorations";
import { HandUnderline } from "../components/HandUnderline";
import { ImpactLines } from "../components/ImpactLines";
import { Pill } from "../components/Pill";
import { PlacedRobot, robotScreen, type Eyes } from "../components/Robot";
import { SpeechBubble } from "../components/SpeechBubble";
import { StickerText } from "../components/StickerText";
import { C, stickerText } from "../theme";
import { clamp, softSpring, squashFromVelocity } from "../utils/motion";
import { parseTitle, plainTitle, textWidth } from "../utils/title";
import { DEFAULT_INTENSITY, type OpeningProps } from "./types";

// 开场 A（5 秒）：标题逐字蹦出 + 盖章砸下，机器人从天而降落到右下角，最后推进屏幕
export const OPENING_A_FRAMES = 150;

const TITLE_BOX = { left: 60, width: 1300, centerY: 540 };
const ROBOT = { cx: 1640, bottom: 1010, scale: 1.5 };
const SCREEN = robotScreen(ROBOT);
const EXIT_START = 122;

export const OpeningA: React.FC<OpeningProps> = ({ no, titleLines, channelName, greeting = "开讲啦～", intensity = DEFAULT_INTENSITY }) => {
  const K = intensity;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sp = (start: number, damping: number, stiffness: number, mass = 1) => softSpring(frame, fps, start, K, { damping, stiffness, mass });

  // 圆形开场
  const open = spring({ frame, fps, config: { damping: 200 }, durationInFrames: 14 });

  // 标题：第一行逐字蹦出，最后一行盖章砸下
  const lineStart = (i: number) => 10 + i * 18;
  const lastLand = lineStart(titleLines.length - 1) + 6;
  const stampShake = frame >= lastLand ? interpolate(frame, [lastLand, lastLand + 12], [1, 0], clamp) : 0;

  // 机器人落地
  const DROP_AT = lastLand + 8;
  const drop = sp(DROP_AT, 9, 110, 0.9);
  const squash = squashFromVelocity(drop, sp(DROP_AT + 1, 9, 110, 0.9), K);
  const landFrame = DROP_AT + 9;
  const impact = interpolate(frame, [landFrame, landFrame + 13], [0, 1], clamp);
  const landShake = frame >= landFrame ? interpolate(frame, [landFrame, landFrame + 10], [0.7, 0], clamp) : 0;
  const shake = Math.max(stampShake, landShake);

  const calm = 1 - interpolate(frame, [EXIT_START - 8, EXIT_START], [0, 1], clamp);
  const idle = interpolate(frame, [landFrame + 10, landFrame + 24], [0, 1], clamp) * calm;
  const bob = Math.sin(frame / 7) * 8 * K * idle;
  const tilt = (-8 + Math.sin(frame / 11) * 3 * K) * calm;
  const handle = frame > DROP_AT ? Math.sin(frame / 3.2) * 16 * K * Math.exp(-Math.max(0, frame - landFrame) / 18) : 0;

  let eyes: Eyes = "ring";
  if (frame >= landFrame + 22 && frame < landFrame + 26) eyes = "blink";
  if (frame >= landFrame + 30 && frame < EXIT_START) eyes = "happy";
  if (frame >= EXIT_START) eyes = "star";

  const bubble = sp(landFrame + 30, 9, 160) * interpolate(frame, [EXIT_START - 6, EXIT_START], [1, 0], clamp);
  const tag = sp(4, 10, 140);
  const underline = interpolate(frame, [lastLand + 4, lastLand + 22], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });

  // 结尾推进屏幕
  const exitP = interpolate(frame, [EXIT_START, OPENING_A_FRAMES], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  const camScale = interpolate(exitP, [0, 1], [1, 18]);

  const fontSizes = titleLines.map((l, i) => Math.min(i === 0 && titleLines.length > 1 ? 300 : 200, TITLE_BOX.width / textWidth(plainTitle(l))));
  const lineGap = 28;
  const totalH = fontSizes.reduce((a, b) => a + b * 1.1, 0) + lineGap * (titleLines.length - 1);
  let y = TITLE_BOX.centerY - totalH / 2;
  const mid = TITLE_BOX.left + TITLE_BOX.width / 2;

  return (
    <AbsoluteFill style={{ backgroundColor: C.ink }}>
      <AbsoluteFill style={{ clipPath: `circle(${open * 2300}px at 960px 540px)` }}>
        <AbsoluteFill
          style={{
            transform: `translate(${Math.sin(frame * 2.7) * 18 * K * shake}px, ${Math.cos(frame * 3.3) * 12 * K * shake}px) scale(${camScale})`,
            transformOrigin: `${SCREEN.cx}px ${SCREEN.cy}px`,
          }}
        >
          <PaperBackground />

          {[
            { x: 140, y: 200, r: 24, c: C.green, d: 18 },
            { x: 1800, y: 150, r: 32, c: C.yellow, d: 24 },
            { x: 200, y: 960, r: 28, c: C.pink, d: 30 },
            { x: 1280, y: 980, r: 18, c: C.purple, d: 36 },
          ].map((p, i) => (
            <FloatingDot key={i} x={p.x} y={p.y} r={p.r} color={p.c} scale={sp(p.d, 8, 140)} offsetY={Math.sin((frame + i * 20) / 14) * 12 * K} />
          ))}

          <div
            style={{
              position: "absolute",
              left: TITLE_BOX.left,
              width: TITLE_BOX.width,
              top: 80,
              display: "flex",
              justifyContent: "center",
              transform: `translateY(${(1 - tag) * -220}px) rotate(${-3 + Math.sin(frame / 10) * 1.5 * K}deg)`,
            }}
          >
            <Pill shadowColor={C.purple}>
              {channelName} · 第 {no} 期
            </Pill>
          </div>

          {titleLines.map((line, li) => {
            const fs = fontSizes[li];
            const top = y;
            y += fs * 1.1 + lineGap;
            const start = lineStart(li);
            const row: React.CSSProperties = { position: "absolute", left: TITLE_BOX.left, width: TITLE_BOX.width, top, display: "flex", justifyContent: "center" };
            if (li === titleLines.length - 1 && titleLines.length > 1) {
              // 盖章
              const s = sp(start, 12, 220);
              return (
                <div
                  key={li}
                  style={{
                    ...row,
                    opacity: frame < start ? 0 : interpolate(s, [0, 0.2], [0, 1], clamp),
                    transform: `scale(${interpolate(s, [0, 1], [1 + 2.2 * K, 1])}) rotate(${-2 + Math.sin(frame / 12) * K}deg)`,
                  }}
                >
                  <StickerText text={line} fontSize={fs} style={{ lineHeight: 1.1 }} />
                </div>
              );
            }
            // 逐字蹦出
            let ci = 0;
            return (
              <div key={li} style={{ ...row, fontSize: fs, lineHeight: 1.1, whiteSpace: "nowrap" }}>
                {parseTitle(line).map((sg) =>
                  Array.from(sg.text).map((ch) => {
                    const i = ci++;
                    if (ch === " ") return <span key={i} style={{ width: fs * 0.3 }} />;
                    const s = sp(start + i * 3, 8, 180);
                    const restTilt = (random(`t-${li}-${i}`) - 0.5) * 10 * K;
                    const wob = Math.sin((frame + i * 8) / 9) * 2 * K;
                    return (
                      <span
                        key={i}
                        style={{
                          display: "inline-block",
                          ...stickerText(sg.hi ? C.purple : C.yellow, 9, 12),
                          transform: `translateY(${(1 - s) * 160 * K}px) scale(${s}) rotate(${interpolate(s, [0, 1], [30 * K, restTilt]) + wob}deg)`,
                        }}
                      >
                        {ch}
                      </span>
                    );
                  }),
                )}
              </div>
            );
          })}

          <HandUnderline x={mid - 420} y={y} width={840} progress={underline} />

          {[
            { x: 230, y: 330, s: 90, c: C.yellow, d: 22 },
            { x: 1500, y: 260, s: 70, c: C.green, d: 28 },
            { x: 150, y: 760, s: 60, c: C.purple, d: 34 },
          ].map((p, i) => (
            <PlacedSparkle key={i} x={p.x} y={p.y} size={p.s} color={p.c} scale={sp(p.d, 7, 160)} rotate={frame * 2 * K + i * 40} />
          ))}

          <ImpactLines x={ROBOT.cx} y={ROBOT.bottom - 30} progress={impact} spread={80 * K} visible={frame >= landFrame} />
          <GroundShadow cx={ROBOT.cx} y={ROBOT.bottom - 12} width={340} opacity={0.18 * drop} scaleX={0.6 + 0.4 * drop - bob / 80} />
          <PlacedRobot
            {...ROBOT}
            offsetY={interpolate(drop, [0, 1], [-1200, 0]) + bob}
            rotate={tilt}
            squash={squash}
            eyes={eyes}
            handleAngle={handle}
            showLines={frame > landFrame + 10 && frame % 16 < 10}
            mouthWidth={eyes === "happy" ? 64 : 40}
          />
          <SpeechBubble x={ROBOT.cx - 380} y={ROBOT.bottom - 600} scale={bubble} rotate={6 + Math.sin(frame / 6) * 2 * K}>
            {greeting}
          </SpeechBubble>
        </AbsoluteFill>
      </AbsoluteFill>
      <AbsoluteFill style={{ backgroundColor: C.screen, opacity: interpolate(frame, [140, 149], [0, 1], clamp) }} />
    </AbsoluteFill>
  );
};
