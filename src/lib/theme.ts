import { loadFont } from "@remotion/fonts";
import type React from "react";
import { staticFile } from "remotion";

// ===== 配色（风格 D：手绘贴纸风）=====
export const C = {
  paper: "#F4F1EA", // 纸底
  ink: "#111111", // 墨黑：字、描边、投影
  purple: "#8B6CFF", // 主色：高亮字、机器人
  purpleDark: "#6A4BE0",
  green: "#39FF88", // 像素绿：机器人眼睛、下划线
  yellow: "#FFD84D", // 标题主色
  pink: "#FF8FB1",
  screen: "#141428", // 机器人屏幕
  white: "#FFFFFF",
};

// ===== 字体（文件放在 public/fonts）=====
export const FONT_TITLE = "HuangYou"; // 站酷庆科黄油体：标题
export const FONT_BODY = "NotoSansSC"; // 思源黑体：正文、标签

loadFont({ family: FONT_TITLE, url: staticFile("fonts/HuangYou.ttf") });
loadFont({ family: FONT_BODY, url: staticFile("fonts/NotoSansSC-500.ttf"), weight: "500" });
loadFont({ family: FONT_BODY, url: staticFile("fonts/NotoSansSC-700.ttf"), weight: "700" });
loadFont({ family: FONT_BODY, url: staticFile("fonts/NotoSansSC-900.ttf"), weight: "900" });

// 立体贴纸字样式：黑描边 + 硬投影
export const stickerText = (fill: string, stroke = 6, shadow = 8): React.CSSProperties => ({
  fontFamily: FONT_TITLE,
  color: fill,
  WebkitTextStroke: `${stroke}px ${C.ink}`,
  paintOrder: "stroke fill",
  textShadow: `${shadow}px ${shadow}px 0 ${C.ink}`,
});
