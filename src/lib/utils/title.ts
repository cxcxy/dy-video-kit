// 标题文字工具：【】括起来的字高亮
export type Seg = { text: string; hi: boolean };
export const parseTitle = (line: string): Seg[] => {
  const out: Seg[] = [];
  const re = /【([^】]*)】/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(line))) {
    if (m.index > last) out.push({ text: line.slice(last, m.index), hi: false });
    out.push({ text: m[1], hi: true });
    last = m.index + m[0].length;
  }
  if (last < line.length) out.push({ text: line.slice(last), hi: false });
  return out;
};
export const plainTitle = (line: string) => line.replace(/[【】]/g, "");
// 估算字宽（单位：字号）：中文 1，英文数字 0.62
export const charWidth = (ch: string) => (ch.charCodeAt(0) <= 0xff ? 0.62 : 1);
export const textWidth = (s: string) => Array.from(s).reduce((w, ch) => w + charWidth(ch), 0);
