import type React from "react";
import {
  BRAND_INTRO_FRAMES,
  BrandIntro,
  OPENING_A_FRAMES,
  OPENING_B_FRAMES,
  OPENING_C_FRAMES,
  OpeningA,
  OpeningB,
  OpeningC,
} from "../../src/lib";
import * as D from "./demos";

// 源码（原文导入，用于展示和复制）
import srcOpeningA from "../../src/lib/openings/OpeningA.tsx?raw";
import srcOpeningB from "../../src/lib/openings/OpeningB.tsx?raw";
import srcOpeningC from "../../src/lib/openings/OpeningC.tsx?raw";
import srcBrand from "../../src/lib/openings/BrandIntro.tsx?raw";
import srcTypes from "../../src/lib/openings/types.ts?raw";
import srcPaper from "../../src/lib/components/PaperBackground.tsx?raw";
import srcRobot from "../../src/lib/components/Robot.tsx?raw";
import srcSticker from "../../src/lib/components/StickerText.tsx?raw";
import srcBubble from "../../src/lib/components/SpeechBubble.tsx?raw";
import srcPill from "../../src/lib/components/Pill.tsx?raw";
import srcChip from "../../src/lib/components/PointChip.tsx?raw";
import srcUnderline from "../../src/lib/components/HandUnderline.tsx?raw";
import srcImpact from "../../src/lib/components/ImpactLines.tsx?raw";
import srcDeco from "../../src/lib/components/Decorations.tsx?raw";
import srcSparkle from "../../src/lib/components/Sparkle.tsx?raw";
import srcTheme from "../../src/lib/theme.ts?raw";
import srcMotion from "../../src/lib/utils/motion.ts?raw";
import srcTitle from "../../src/lib/utils/title.ts?raw";

export type Entry = {
  id: string;
  name: string;
  category: "开场模板" | "基础组件";
  desc: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: React.FC<any>;
  durationInFrames: number;
  defaultProps?: Record<string, unknown>;
  editable?: boolean; // 是否显示开场参数编辑面板
  usage: string;
  sources: { file: string; code: string }[];
  badge?: string;
};

const openingProps = {
  no: "01",
  titleLines: ["【Muse】", "零基础教程来了"],
  channelName: "AI 机器盒",
  hook: "不用写代码，10 分钟就能上手",
  points: ["它是什么", "怎么安装", "上手实操"],
  intensity: 0.56,
};

const openingUsage = (name: string, frames: string) => `import { ${name}, ${frames} } from "./lib";

<Composition
  id="${name}"
  component={${name}}
  durationInFrames={${frames}}
  fps={30}
  width={1920}
  height={1080}
  defaultProps={{
    no: "01",
    titleLines: ["【Muse】", "零基础教程来了"],
    channelName: "AI 机器盒",
    hook: "不用写代码，10 分钟就能上手",
    points: ["它是什么", "怎么安装", "上手实操"],
    intensity: 0.56,
  }}
/>`;

export const entries: Entry[] = [
  {
    id: "opening-c",
    name: "OpeningC 首帧即标题",
    category: "开场模板",
    badge: "当前使用",
    desc: "第 0 帧就是完整标题（首帧即封面），0.4 秒弹出钩子，1.2~2 秒弹出 3 个要点，之后约每秒一个小变化，最后推进机器人屏幕接正文。为降低 2 秒跳出率设计。",
    component: OpeningC,
    durationInFrames: OPENING_C_FRAMES,
    defaultProps: openingProps,
    editable: true,
    usage: openingUsage("OpeningC", "OPENING_C_FRAMES"),
    sources: [
      { file: "openings/OpeningC.tsx", code: srcOpeningC },
      { file: "openings/types.ts", code: srcTypes },
    ],
  },
  {
    id: "opening-a",
    name: "OpeningA 盖章砸落",
    category: "开场模板",
    desc: "圆形开场，标题第一行逐字蹦出、最后一行盖章砸下带震动，机器人从天而降落到右下角并说话，最后推进屏幕。",
    component: OpeningA,
    durationInFrames: OPENING_A_FRAMES,
    defaultProps: openingProps,
    editable: true,
    usage: openingUsage("OpeningA", "OPENING_A_FRAMES"),
    sources: [
      { file: "openings/OpeningA.tsx", code: srcOpeningA },
      { file: "openings/types.ts", code: srcTypes },
    ],
  },
  {
    id: "opening-b",
    name: "OpeningB 屏幕打字",
    category: "开场模板",
    desc: "镜头从机器人屏幕里开始，主题被一个字一个字打出来；拉远后露出机器人，字沿弧线飞出贴到纸上，第二行像贴胶带一样铺开。安静、有电影感。",
    component: OpeningB,
    durationInFrames: OPENING_B_FRAMES,
    defaultProps: openingProps,
    editable: true,
    usage: openingUsage("OpeningB", "OPENING_B_FRAMES"),
    sources: [
      { file: "openings/OpeningB.tsx", code: srcOpeningB },
      { file: "openings/types.ts", code: srcTypes },
    ],
  },
  {
    id: "brand-intro",
    name: "BrandIntro 品牌动画",
    category: "开场模板",
    desc: "机器人落地 + 账号名逐字弹出 + 口号滑入，可以放在片尾做关注引导。",
    component: BrandIntro,
    durationInFrames: BRAND_INTRO_FRAMES,
    defaultProps: { channelName: "AI 机器盒", nameHighlight: [0, 1], slogan: "每天 3 分钟，搞懂一个 AI 知识" },
    usage: `import { BrandIntro, BRAND_INTRO_FRAMES } from "./lib";

<Composition
  id="BrandIntro"
  component={BrandIntro}
  durationInFrames={BRAND_INTRO_FRAMES}
  fps={30}
  width={1920}
  height={1080}
  defaultProps={{ channelName: "AI 机器盒", nameHighlight: [0, 1], slogan: "每天 3 分钟，搞懂一个 AI 知识" }}
/>`,
    sources: [{ file: "openings/BrandIntro.tsx", code: srcBrand }],
  },
  {
    id: "robot",
    name: "Robot / PlacedRobot 吉祥物",
    category: "基础组件",
    desc: "紫色机器盒吉祥物。eyes 换表情（ring / blink / happy / star / none），PlacedRobot 以脚底为锚点摆放，支持上下位移、旋转、挤压拉伸。robotScreen() 算出屏幕位置，用于镜头推进。",
    component: D.RobotDemo,
    durationInFrames: 88,
    usage: `import { PlacedRobot, robotScreen } from "./lib";

<PlacedRobot cx={1600} bottom={1000} scale={1.4} eyes="happy" handleAngle={8} rotate={-6} squash={0} />

// 屏幕中心，用于推进镜头
const screen = robotScreen({ cx: 1600, bottom: 1000, scale: 1.4 });`,
    sources: [{ file: "components/Robot.tsx", code: srcRobot }],
  },
  {
    id: "sticker-text",
    name: "StickerText 立体贴纸字",
    category: "基础组件",
    desc: "黄字黑描边 + 硬投影的立体标题字，【】括起来的部分变紫色。color / hiColor 可换色。",
    component: D.StickerTextDemo,
    durationInFrames: 60,
    usage: `import { StickerText, C } from "./lib";

<StickerText text="【Muse】零基础教程来了" fontSize={180} />
<StickerText text="换个颜色" fontSize={120} color={C.white} hiColor={C.green} />`,
    sources: [
      { file: "components/StickerText.tsx", code: srcSticker },
      { file: "utils/title.ts", code: srcTitle },
    ],
  },
  {
    id: "paper",
    name: "PaperBackground 纸面背景",
    category: "基础组件",
    desc: "米白纸底 + 黑色噪点，噪点每 4 帧换一次，让静止画面也有手绘动画的“呼吸感”。",
    component: D.PaperDemo,
    durationInFrames: 60,
    usage: `import { PaperBackground } from "./lib";

<PaperBackground />            // 默认
<PaperBackground count={700} /> // 噪点更少更轻`,
    sources: [{ file: "components/PaperBackground.tsx", code: srcPaper }],
  },
  {
    id: "bubble",
    name: "SpeechBubble 对话气泡",
    category: "基础组件",
    desc: "白底粗描边、带硬投影的对话气泡。scale 从 0 到 1 就是弹出动画。",
    component: D.BubbleDemo,
    durationInFrames: 60,
    usage: `import { SpeechBubble, softSpring } from "./lib";

const s = softSpring(frame, fps, 20, 0.56);
<SpeechBubble x={1200} y={400} scale={s} rotate={6}>开讲啦～</SpeechBubble>`,
    sources: [{ file: "components/SpeechBubble.tsx", code: srcBubble }],
  },
  {
    id: "pill",
    name: "Pill 胶囊标签",
    category: "基础组件",
    desc: "黑色胶囊，用于期数、账号、口号。shadowColor 给一个彩色硬投影。",
    component: D.PillDemo,
    durationInFrames: 60,
    usage: `import { Pill, C } from "./lib";

<Pill shadowColor={C.purple}>AI 机器盒 · 第 01 期</Pill>`,
    sources: [{ file: "components/Pill.tsx", code: srcPill }],
  },
  {
    id: "point-chip",
    name: "PointChip 要点胶囊",
    category: "基础组件",
    desc: "带序号圆点的要点胶囊，常用 3 个一排列出本期要点。",
    component: D.PointChipDemo,
    durationInFrames: 70,
    usage: `import { PointChip, C } from "./lib";

<PointChip index={1} text="它是什么" dotColor={C.green} />`,
    sources: [{ file: "components/PointChip.tsx", code: srcChip }],
  },
  {
    id: "underline",
    name: "HandUnderline 手绘下划线",
    category: "基础组件",
    desc: "手绘感的波浪下划线，progress 从 0 到 1 就是“画出来”的动画。",
    component: D.UnderlineDemo,
    durationInFrames: 60,
    usage: `import { HandUnderline, clamp } from "./lib";

const p = interpolate(frame, [10, 30], [0, 1], clamp);
<HandUnderline x={200} y={600} width={800} progress={p} />`,
    sources: [{ file: "components/HandUnderline.tsx", code: srcUnderline }],
  },
  {
    id: "impact",
    name: "ImpactLines 冲击线",
    category: "基础组件",
    desc: "物体落地时向上半圈散开的冲击线，progress 0→1 时扩散并淡出。",
    component: D.ImpactDemo,
    durationInFrames: 45,
    usage: `import { ImpactLines } from "./lib";

<ImpactLines x={960} y={900} progress={impact} visible={frame >= landFrame} />`,
    sources: [{ file: "components/ImpactLines.tsx", code: srcImpact }],
  },
  {
    id: "decorations",
    name: "装饰：圆点 / 星星 / 阴影",
    category: "基础组件",
    desc: "FloatingDot 彩色圆点贴纸、PlacedSparkle 四角星、GroundShadow 地面阴影。",
    component: D.DecorationsDemo,
    durationInFrames: 90,
    usage: `import { FloatingDot, PlacedSparkle, GroundShadow, C } from "./lib";

<FloatingDot x={200} y={300} r={30} color={C.green} scale={s} />
<PlacedSparkle x={1500} y={200} size={70} color={C.yellow} scale={s} rotate={frame} />
<GroundShadow cx={1600} y={990} width={340} opacity={0.16} />`,
    sources: [
      { file: "components/Decorations.tsx", code: srcDeco },
      { file: "components/Sparkle.tsx", code: srcSparkle },
    ],
  },
];

export const themeSources = [
  { file: "theme.ts", code: srcTheme },
  { file: "utils/motion.ts", code: srcMotion },
];
