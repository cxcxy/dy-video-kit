// 所有开场组件共用的参数
export type OpeningProps = {
  no: string; // 期数，如 "01"
  titleLines: string[]; // 标题，每个字符串一行，【】内的字高亮
  channelName: string; // 账号名
  hook?: string; // 钩子句（C 用）
  points?: string[]; // 本期要点，最多 3 个（C 用）
  greeting?: string; // 机器人气泡里的话（A 用）
  intensity?: number; // 动画力度，1 = 原始，默认 0.56
};

export const DEFAULT_INTENSITY = 0.56;
