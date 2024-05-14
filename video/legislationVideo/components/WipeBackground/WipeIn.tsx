import React from "react";
import { interpolate, useCurrentFrame, Easing } from "remotion";
import { VIDEO_FPS, SCENE_LENGTH_IN_FRAMES } from "types/constants";
import styles from "./WipeBackground.module.scss";

const wipeInLength = 1 * VIDEO_FPS; // 1 second

interface WipeInProps {
  delay?: number; // delay in frames
}

export const WipeIn: React.FC<WipeInProps> = ({
  delay = SCENE_LENGTH_IN_FRAMES,
}) => {
  const frame = useCurrentFrame();

  const startFrame = delay - wipeInLength;
  const endFrame = delay;

  const width = interpolate(frame, [startFrame, endFrame], [0, 100], {
    easing: Easing.bezier(0.7, 0, 0.84, 0),
    extrapolateRight: "clamp",
  });

  return (
    <div className={styles.WipeBackground} style={{ width: `${width}%` }}></div>
  );
};

export default WipeIn;
