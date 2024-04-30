import React from "react";
import { interpolate, useCurrentFrame, Easing } from "remotion";
import { VIDEO_FPS } from "types/constants";
import styles from "./WipeBackground.module.scss";

const wipeOutLength = 0.25 * VIDEO_FPS; // 0.25 seconds

const WipeOut: React.FC = () => {
  const frame = useCurrentFrame();

  // Moves the container off screen after width animation is done
  const left = interpolate(frame, [0, 0 + wipeOutLength], [0, 100], {
    easing: Easing.bezier(0.76, 0, 0.24, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      className={styles.WipeBackground}
      style={{ width: "100%", left: `${left}%` }}
    ></div>
  );
};

export default WipeOut;
