import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { PlacedSparkle } from "../components/Decorations";
import { PaperBackground } from "../components/PaperBackground";
import { PlacedRobot, Robot, robotScreen, type Eyes } from "../components/Robot";
import { StickerText } from "../components/StickerText";
import { C, FONT_BODY, stickerText } from "../theme";
import { clamp } from "../utils/motion";
import { charWidth, parseTitle, plainTitle, textWidth } from "../utils/title";
import { DEFAULT_INTENSITY, type OpeningProps } from "./types";

// 开场 B（5 秒）："机器人想出了本期主题"
// 镜头从机器人屏幕里开始：主题被一个字一个字打出来 → 镜头拉远露出机器人 → 字从屏幕里飞出来贴到纸上
export const OPENING_B_FRAMES = 150;

const ROBOT = { cx: 450, bottom: 900, scale: 2.0 };
// 机器人屏幕在画面里的位置
const SCREEN = robotScreen(ROBOT);
const SCREEN_C = { x: SCREEN.cx, y: SCREEN.cy };
const TITLE = { left: 840, width: 1020, centerY: 560 };

const T = {
  typeStart: 6, // 屏幕上开始打字
  pullStart: 30, // 镜头开始拉远
  pullEnd: 64,
  launch: 60, // 字从屏幕飞出
};

export const OpeningB: React.FC<OpeningProps> = ({ no, titleLines, channelName, intensity = DEFAULT_INTENSITY }) => {
  // B 本身就是安静的设计，力度只影响漂浮和提手摆动（以 0.56 为基准）
  const K = intensity / DEFAULT_INTENSITY;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // —— 镜头：从屏幕特写拉远，之后极慢地推近（呼吸感）
  const pull = interpolate(frame, [T.pullStart, T.pullEnd], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const drift = interpolate(frame, [T.pullEnd, OPENING_B_FRAMES], [1, 1.03], clamp);
  const camScale = Math.pow(9, 1 - pull) * drift;
  // 镜头焦点：从屏幕中心移到画面中心
  const focus = {
    x: interpolate(pull, [0, 1], [SCREEN_C.x, 960]),
    y: interpolate(pull, [0, 1], [SCREEN_C.y, 540]),
  };
  const camTx = 960 - focus.x * camScale;
  const camTy = 540 - focus.y * camScale;

  // —— 屏幕上打字
  const typed = (li: number) => {
    const before = titleLines.slice(0, li).reduce((n, l) => n + Array.from(plainTitle(l)).length, 0);
    const n = Math.floor((frame - T.typeStart) / 1.6) - before - li * 3;
    return Array.from(plainTitle(titleLines[li])).slice(0, Math.max(0, n)).join("");
  };
  const screenTextOpacity = interpolate(frame, [T.launch, T.launch + 4], [1, 0], clamp);
  const cursorOn = Math.floor(frame / 6) % 2 === 0;

  // —— 机器人：字飞出后才"睁眼"
  let eyes: Eyes = "none";
  if (frame >= T.launch + 6) eyes = "ring";
  if (frame >= T.launch + 34 && frame < T.launch + 38) eyes = "blink";
  if (frame >= T.launch + 44) eyes = "happy";
  const eyesPop = spring({ frame: frame - T.launch - 6, fps, config: { damping: 14 } });
  const float = Math.sin(frame / 14) * 6 * K * interpolate(frame, [T.pullEnd, T.pullEnd + 20], [0, 1], clamp);
  const handle = Math.sin(frame / 10) * 4 * K;

  // —— 标题排版
  const fontSizes = titleLines.map((l, i) =>
    Math.min(i === 0 && titleLines.length > 1 ? 260 : 170, TITLE.width / textWidth(plainTitle(l))),
  );
  const gap = 24;
  const totalH = fontSizes.reduce((a, b) => a + b * 1.08, 0) + gap * (titleLines.length - 1);
  let y = TITLE.centerY - totalH / 2 + 30;
  let underlineY = 0;
  let underlineW = 0;

  const tag = spring({ frame: frame - (T.launch + 30), fps, config: { damping: 16, stiffness: 120 } });

  return (
    <AbsoluteFill style={{ backgroundColor: C.screen, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          transformOrigin: "0 0",
          transform: `translate(${camTx}px, ${camTy}px) scale(${camScale})`,
        }}
      >
        <PaperBackground />

        {/* 机器人：睁眼时屏幕轻轻"弹"一下 */}
        <PlacedRobot {...ROBOT} offsetY={float}>
          <div style={{ transform: `scaleY(${eyes === "none" ? 1 : 0.85 + 0.15 * eyesPop})`, transformOrigin: "50% 55%" }}>
            <Robot eyes={eyes} handleAngle={handle} showLines={false} mouthWidth={eyes === "happy" ? 60 : 40} />
          </div>
        </PlacedRobot>

        {/* 屏幕里的打字内容 + 扫描线 */}
        <div
          style={{
            position: "absolute",
            left: SCREEN.x + 6,
            top: SCREEN.y + 6 + float,
            width: SCREEN.w - 12,
            height: SCREEN.h - 12,
            borderRadius: 22,
            overflow: "hidden",
            opacity: screenTextOpacity,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            fontFamily: FONT_BODY,
            fontWeight: 900,
            color: C.green,
            textShadow: `0 0 4px ${C.green}`,
            backgroundImage: "repeating-linear-gradient(0deg, rgba(57,255,136,0.08) 0 1px, transparent 1px 3px)",
          }}
        >
          {titleLines.map((l, li) => (
            <div key={li} style={{ fontSize: li === 0 ? 22 : 11, lineHeight: 1.2, whiteSpace: "nowrap" }}>
              {typed(li)}
              {cursorOn && typed(li).length < Array.from(plainTitle(l)).length && typed(li).length > 0 ? "▌" : ""}
              {li === 0 && typed(0).length === 0 && cursorOn ? "▌" : ""}
            </div>
          ))}
        </div>

        {/* 标题各行 */}
        {titleLines.map((line, li) => {
          const fs = fontSizes[li];
          const top = y;
          y += fs * 1.08 + gap;
          const segs = parseTitle(line);
          const lineW = textWidth(plainTitle(line)) * fs;
          if (li === titleLines.length - 1) {
            underlineY = top + fs * 1.08 + 18;
            underlineW = lineW;
          }

          if (li === 0) {
            // 第一行：每个字从机器人屏幕里沿弧线飞出来
            let x = 0;
            let ci = 0;
            return (
              <div key={li} style={{ position: "absolute", left: TITLE.left, top, fontSize: fs, lineHeight: 1.08, whiteSpace: "nowrap" }}>
                {segs.map((sg) =>
                  Array.from(sg.text).map((ch) => {
                    const i = ci++;
                    const w = charWidth(ch) * fs;
                    const cx = TITLE.left + x + w / 2;
                    const cy = top + fs * 0.54;
                    x += w;
                    const p = spring({ frame: frame - T.launch - i * 4, fps, config: { damping: 18, stiffness: 90 } });
                    const dx = (SCREEN_C.x - cx) * (1 - p);
                    const dy = (SCREEN_C.y - cy) * (1 - p) - Math.sin(p * Math.PI) * 140;
                    return (
                      <span
                        key={i}
                        style={{
                          display: "inline-block",
                          opacity: frame < T.launch + i * 4 ? 0 : 1,
                          ...stickerText(sg.hi ? C.purple : C.yellow, 9, 12),
                          transform: `translate(${dx}px, ${dy}px) scale(${0.12 + 0.88 * p}) rotate(${(1 - p) * -24}deg)`,
                        }}
                      >
                        {ch === " " ? " " : ch}
                      </span>
                    );
                  }),
                )}
              </div>
            );
          }

          // 其它行：像贴胶带一样从左往右铺开
          const start = T.launch + 14 + li * 8;
          const wipe = interpolate(frame, [start, start + 16], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
          return (
            <div
              key={li}
              style={{
                position: "absolute",
                left: TITLE.left,
                top,
                fontSize: fs,
                lineHeight: 1.08,
                whiteSpace: "nowrap",
                padding: "0 20px 16px 0",
                clipPath: `inset(-20px ${(1 - wipe) * 100}% -20px -20px)`,
                transform: `translateX(${(1 - wipe) * 30}px)`,
              }}
            >
              <StickerText text={line} fontSize={fs} />
            </div>
          );
        })}

        {/* 绿色胶带下划线 */}
        {(() => {
          const s = interpolate(frame, [T.launch + 34, T.launch + 50], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
          return (
            <div
              style={{
                position: "absolute",
                left: TITLE.left - 10,
                top: underlineY,
                width: Math.min(underlineW * 0.7, 700),
                height: 26,
                background: C.green,
                border: `5px solid ${C.ink}`,
                borderRadius: 6,
                transformOrigin: "0% 50%",
                transform: `rotate(-1.5deg) scaleX(${s})`,
              }}
            />
          );
        })()}

        {/* 账号 + 期数 */}
        <div
          style={{
            position: "absolute",
            left: TITLE.left,
            top: TITLE.centerY - totalH / 2 - 70,
            opacity: tag,
            transform: `translateY(${(1 - tag) * 24}px)`,
            display: "flex",
            alignItems: "center",
            gap: 18,
            fontFamily: FONT_BODY,
            fontWeight: 900,
            fontSize: 44,
            color: C.ink,
          }}
        >
          <span style={{ background: C.ink, color: C.white, padding: "6px 24px", borderRadius: 999 }}>第 {no} 期</span>
          <span>{channelName}</span>
        </div>

        {/* 星星：只闪烁不旋转 */}
        {[
          { x: 1780, y: 260, s: 64, c: C.yellow, d: T.launch + 20 },
          { x: 1820, y: 820, s: 48, c: C.green, d: T.launch + 28 },
          { x: 120, y: 180, s: 56, c: C.purple, d: T.launch + 36 },
        ].map((p, i) => {
          const s = spring({ frame: frame - p.d, fps, config: { damping: 12, stiffness: 140 } });
          const tw = 0.9 + Math.sin((frame - p.d) / 8) * 0.1;
          return <PlacedSparkle key={i} x={p.x} y={p.y} size={p.s} color={p.c} scale={s * tw} />;
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
