import React, { useMemo } from "react";
import { AbsoluteFill, random, useCurrentFrame, useVideoConfig } from "remotion";
import { C } from "../theme";

// 米白纸 + 噪点。噪点每 4 帧换一次，做出手绘动画的"抖动呼吸感"
export const PaperBackground: React.FC<{ boilEvery?: number; count?: number }> = ({
  boilEvery = 4,
  count = 1150,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const seed = Math.floor(frame / boilEvery) % 6;
  const dots = useMemo(() => {
    return new Array(count).fill(0).map((_, i) => {
      const r = (k: string) => random(`paper-${seed}-${i}-${k}`);
      const big = r("b") > 0.9;
      return {
        x: r("x") * width,
        y: r("y") * height,
        s: big ? 1.8 + r("s") * 1.6 : 0.9 + r("s") * 1.1,
        o: 0.25 + r("o") * 0.45,
      };
    });
  }, [seed, count, width, height]);
  return (
    <AbsoluteFill style={{ backgroundColor: C.paper }}>
      <svg width={width} height={height}>
        {dots.map((d, i) => (
          <circle key={i} cx={d.x} cy={d.y} r={d.s} fill={C.ink} opacity={d.o} />
        ))}
      </svg>
    </AbsoluteFill>
  );
};
