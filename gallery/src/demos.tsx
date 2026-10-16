import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import {
  C,
  FloatingDot,
  GroundShadow,
  HandUnderline,
  ImpactLines,
  PaperBackground,
  Pill,
  PlacedRobot,
  PlacedSparkle,
  PointChip,
  SpeechBubble,
  StickerText,
  clamp,
  softSpring,
  type Eyes,
} from "../../src/lib";

// 每个基础组件的演示画面（循环播放）

const usePop = (start: number) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return softSpring(frame, fps, start, 0.56);
};

export const PaperDemo: React.FC = () => <PaperBackground />;

export const RobotDemo: React.FC<{ eyes?: Eyes | "cycle" }> = ({ eyes = "cycle" }) => {
  const frame = useCurrentFrame();
  const order: Eyes[] = ["ring", "blink", "happy", "star"];
  const e = eyes === "cycle" ? order[Math.floor(frame / 22) % order.length] : eyes;
  const bob = Math.sin(frame / 7) * 6;
  return (
    <AbsoluteFill>
      <PaperBackground />
      <GroundShadow cx={960} y={870} width={420} opacity={0.16} scaleX={1 - bob / 80} />
      <PlacedRobot cx={960} bottom={880} scale={2} offsetY={bob} rotate={Math.sin(frame / 11) * 2} eyes={e} handleAngle={Math.sin(frame / 5) * 8} mouthWidth={e === "happy" ? 60 : 40} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 80, display: "flex", justifyContent: "center" }}>
        <Pill>eyes = "{e}"</Pill>
      </div>
    </AbsoluteFill>
  );
};

export const StickerTextDemo: React.FC<{ text?: string }> = ({ text = "【Muse】零基础教程来了" }) => {
  const s = usePop(4);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <PaperBackground />
      <StickerText text={text} fontSize={180} style={{ transform: `scale(${s}) rotate(-2deg)` }} />
    </AbsoluteFill>
  );
};

export const BubbleDemo: React.FC = () => {
  const s = usePop(6);
  return (
    <AbsoluteFill>
      <PaperBackground />
      <SpeechBubble x={660} y={420} scale={s} rotate={-4} fontSize={110} origin="50% 100%">
        开讲啦～
      </SpeechBubble>
    </AbsoluteFill>
  );
};

export const PillDemo: React.FC = () => {
  const a = usePop(4);
  const b = usePop(14);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 60 }}>
      <PaperBackground />
      <div style={{ transform: `scale(${a}) rotate(-3deg)` }}>
        <Pill fontSize={80} shadowColor={C.purple}>
          AI 机器盒 · 第 01 期
        </Pill>
      </div>
      <div style={{ transform: `scale(${b}) rotate(2deg)` }}>
        <Pill fontSize={64} shadowColor={C.green}>
          每天 3 分钟，搞懂一个 AI 知识
        </Pill>
      </div>
    </AbsoluteFill>
  );
};

export const PointChipDemo: React.FC = () => {
  const items = ["它是什么", "怎么安装", "上手实操"];
  const colors = [C.green, C.purple, C.yellow];
  const pops = [usePop(4), usePop(14), usePop(24)];
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <PaperBackground />
      <div style={{ display: "flex", gap: 40 }}>
        {items.map((t, i) => (
          <PointChip key={i} index={i + 1} text={t} dotColor={colors[i]} fontSize={70} style={{ transform: `translateY(${(1 - pops[i]) * 60}px) scale(${pops[i]})` }} />
        ))}
      </div>
    </AbsoluteFill>
  );
};

export const UnderlineDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [6, 30], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <PaperBackground />
      <StickerText text="划重点" fontSize={220} style={{ position: "absolute", left: 640, top: 330 }} />
      <HandUnderline x={600} y={640} width={720} progress={p} />
    </AbsoluteFill>
  );
};

export const ImpactDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame % 45;
  return (
    <AbsoluteFill>
      <PaperBackground />
      <ImpactLines x={960} y={780} progress={interpolate(t, [0, 16], [0, 1], clamp)} radius={320} />
      <PlacedRobot cx={960} bottom={820} scale={1.6} eyes="star" />
    </AbsoluteFill>
  );
};

export const DecorationsDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const dots = [
    { x: 500, y: 400, r: 50, c: C.green, d: 2 },
    { x: 1400, y: 360, r: 64, c: C.yellow, d: 8 },
    { x: 760, y: 720, r: 40, c: C.pink, d: 14 },
    { x: 1200, y: 760, r: 34, c: C.purple, d: 20 },
  ];
  const stars = [
    { x: 960, y: 520, s: 220, c: C.yellow, d: 4 },
    { x: 640, y: 600, s: 110, c: C.purple, d: 12 },
    { x: 1300, y: 560, s: 130, c: C.green, d: 18 },
  ];
  const pops = [...dots, ...stars].map((p) => usePop(p.d));
  return (
    <AbsoluteFill>
      <PaperBackground />
      {dots.map((p, i) => (
        <FloatingDot key={i} x={p.x} y={p.y} r={p.r} color={p.c} scale={pops[i]} offsetY={Math.sin((frame + i * 20) / 14) * 10} />
      ))}
      {stars.map((p, i) => (
        <PlacedSparkle key={i} x={p.x} y={p.y} size={p.s} color={p.c} scale={pops[dots.length + i]} rotate={frame + i * 30} />
      ))}
    </AbsoluteFill>
  );
};
