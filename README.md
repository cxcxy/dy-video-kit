# 我的视频组件库（Remotion · 横版 1920×1080）

手绘贴纸风的 AI 科普视频模板。所有可复用的东西都在 `src/lib/` 里，每期视频只改 `src/episode.ts`。

## 目录结构

```
src/
├── channel.ts          频道信息（账号名、口号），所有视频共用
├── episode.ts          每一期要改的内容（期数、标题、钩子、要点）
├── Root.tsx            在 Studio 里注册要渲染的视频
└── lib/                ★ 组件库
    ├── index.ts        统一出口：import { ... } from "./lib"
    ├── theme.ts        配色 C、字体、立体贴纸字样式 stickerText()
    ├── utils/
    │   ├── motion.ts   clamp、softSpring（带力度的弹簧）、squashFromVelocity（挤压拉伸）
    │   └── title.ts    【】高亮解析、字宽估算
    ├── components/     基础组件
    └── openings/       开场模板 A / B / C + 品牌动画
public/fonts/           字体文件（黄油体、思源黑体），theme.ts 自动加载
gallery/                组件预览页（实时预览 + 复制代码）
```

## 组件预览页

```bash
npm run gallery         # 打开 http://localhost:5173
npm run gallery:build   # 打包成静态网页，输出到 gallery-dist/
```

每个组件都有实时动画预览、用法示例和完整源码，一键复制。开场模板还能直接输入标题、钩子、要点、动画力度实时看效果，满意后点「复制为 episode.ts」粘贴回项目。新增组件后，在 `gallery/src/registry.tsx` 里加一条就会出现在预览页里。

## 做新一期

1. 打开 `src/episode.ts`，改期数、标题、钩子、要点：

   ```ts
   export const episode = {
     no: "02",
     titleLines: ["【Cursor】", "三招提升效率"], // 一个字符串一行，【】里的字变紫色
     hook: "写代码速度直接翻倍",                 // 0.4 秒出现的一句话
     points: ["装插件", "写提示词", "改 Bug"],     // 最多 3 个
   };
   ```

2. 预览：`npm run dev`，在左侧「开场」文件夹里选 `OpeningC`。
3. 渲染：`npx remotion render OpeningC out/第02期-开场.mp4`

标题长短不同时字号自动缩放，不会出框。

## 开场模板

| 组件 | 时长 | 特点 |
|---|---|---|
| `OpeningC` ★当前使用 | 5 秒 | 第 0 帧就是完整标题，0.4 秒钩子，1.2~2 秒弹出要点，为降低 2 秒跳出率设计 |
| `OpeningA` | 5 秒 | 标题逐字蹦出 + 盖章砸下，机器人从天而降，最后推进屏幕 |
| `OpeningB` | 5 秒 | 镜头从机器人屏幕里开始打字，拉远后字飞出来贴到纸上，安静有电影感 |
| `BrandIntro` | 5 秒 | 账号名 + 口号的品牌动画，可做片尾关注引导 |

开场共用参数 `OpeningProps`（`openings/types.ts`）：

| 参数 | 说明 |
|---|---|
| `no` | 期数 |
| `titleLines` | 标题行数组，【】高亮 |
| `channelName` | 账号名 |
| `hook` / `points` | 钩子句、要点（C 用） |
| `greeting` | 机器人气泡里的话（A、C 用） |
| `intensity` | 动画力度，`1` = 原始力度，默认 `0.56`（目前定下的轻量版）。想更轻就调小 |

## 基础组件

| 组件 | 作用 | 常用参数 |
|---|---|---|
| `PaperBackground` | 米白纸底 + 每 4 帧"呼吸"一次的噪点 | `count` 噪点数量，`boilEvery` 换帧间隔 |
| `Robot` | 吉祥物机器盒（340×320） | `eyes`: ring / blink / happy / star / none，`handleAngle`，`mouthWidth`，`showLines` |
| `PlacedRobot` | 以脚底为锚点摆放机器人 | `cx`、`bottom`、`scale`、`offsetY`、`rotate`、`squash`，其余同 `Robot` |
| `robotScreen()` | 算出机器人屏幕在画面里的位置 | 用于镜头推进、往屏幕里放字 |
| `StickerText` | 一行黄紫立体贴纸字 | `text`（支持【】）、`fontSize`、`color`、`hiColor` |
| `SpeechBubble` | 白底粗边对话气泡 | `x`、`y`、`scale`（0~1 弹出）、`rotate` |
| `Pill` | 黑色胶囊标签 | `fontSize`、`shadowColor` |
| `PointChip` | 带序号的要点胶囊 | `index`、`text`、`dotColor` |
| `HandUnderline` | 手绘波浪下划线 | `x`、`y`、`width`、`progress`（0~1 画出） |
| `ImpactLines` | 落地冲击线 | `x`、`y`、`progress` |
| `FloatingDot` / `PlacedSparkle` / `GroundShadow` | 圆点、星星、地面阴影装饰 | 位置 + `scale` |
| `Sparkle` | 四角星图形 | `size`、`color` |

用法示例：

```tsx
import { PaperBackground, PlacedRobot, StickerText, softSpring } from "./lib";

const s = softSpring(frame, fps, 10, 0.56); // 第 10 帧开始弹出
<PaperBackground />
<StickerText text="【Muse】零基础" fontSize={200} style={{ transform: `scale(${s})` }} />
<PlacedRobot cx={1600} bottom={1000} scale={1.4} eyes="happy" />
```

## 改风格

- 颜色：`lib/theme.ts` 里的 `C`，改一处全部生效
- 立体字描边粗细、投影距离：`stickerText(fill, stroke, shadow)`
- 噪点轻重：`PaperBackground` 的 `count` 和透明度
- 动画轻重：开场的 `intensity`

## 新增一个组件

1. 在 `src/lib/components/` 新建文件，只依赖 `theme.ts` 和 `utils/`，不要直接读 `channel.ts` / `episode.ts`（内容都通过参数传进来，组件才能复用）
2. 在 `src/lib/index.ts` 里加一行 `export * from "./components/你的组件";`
3. 新开场模板放 `src/lib/openings/`，参数用 `OpeningProps`，然后在 `Root.tsx` 注册

## 环境

```bash
npm i            # 安装依赖
npm run dev      # 打开 Studio 预览
npm run lint     # 检查代码
npx remotion render <视频ID> out/文件名.mp4
```
