import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// 组件预览页：npm run gallery
export default defineConfig({
  root: __dirname,
  base: "./",
  publicDir: "../public", // 和 Remotion 共用字体
  plugins: [react()],
  build: { outDir: "../gallery-dist", emptyOutDir: true },
});
