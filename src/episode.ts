// ====== 每一期要改的内容 ======
export const episode = {
  no: "01", // 期数
  // 本期标题，一个字符串是一行；用【】括起来的字会变成紫色
  titleLines: ["【Muse】", "零基础教程来了"],
  // 钩子：一句话说清"看完你能得到什么"（开场 C 用，第 0.4 秒出现）
  hook: "不用写代码，10 分钟就能上手",
  // 本期要点：3 个以内（开场 C 用）
  points: ["它是什么", "怎么安装", "上手实操"],
};
export type Episode = typeof episode;
