import React from "react";
import { Composition, Folder } from "remotion";
import { channel } from "./channel";
import { episode } from "./episode";
import {
  BRAND_INTRO_FRAMES,
  BrandIntro,
  OPENING_A_FRAMES,
  OPENING_B_FRAMES,
  OPENING_C_FRAMES,
  OpeningA,
  OpeningB,
  OpeningC,
  type OpeningProps,
} from "./lib";

const base = { fps: 30, width: 1920, height: 1080 };
const props: OpeningProps = { ...episode, channelName: channel.channelName };

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Folder name="开场">
        {/* 当前使用：C（首帧即标题，降低 2 秒跳出率） */}
        <Composition id="OpeningC" component={OpeningC} durationInFrames={OPENING_C_FRAMES} {...base} defaultProps={props} />
        <Composition id="OpeningA" component={OpeningA} durationInFrames={OPENING_A_FRAMES} {...base} defaultProps={props} />
        <Composition id="OpeningB" component={OpeningB} durationInFrames={OPENING_B_FRAMES} {...base} defaultProps={props} />
      </Folder>
      <Folder name="品牌">
        <Composition id="BrandIntro" component={BrandIntro} durationInFrames={BRAND_INTRO_FRAMES} {...base} defaultProps={channel} />
      </Folder>
    </>
  );
};
