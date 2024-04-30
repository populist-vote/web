import React from "react";
import { interpolate, useCurrentFrame, Easing } from "remotion";
import { SCENE_LENGTH_IN_FRAMES } from "types/constants";

const container: React.CSSProperties = {
  backgroundColor: "var(--blue-darker)",
  height: "100%",
  zIndex: 999,
  position: "absolute",
  left: 0,
};

export const WipeBG: React.FC = () => {
  const frame = useCurrentFrame();
  const width = interpolate(
    frame,
    [SCENE_LENGTH_IN_FRAMES - 60, SCENE_LENGTH_IN_FRAMES],
    [0, 100],
    {
      easing: Easing.bezier(0.7, 0, 0.84, 0),
      extrapolateRight: "clamp",
    }
  );

  // Moves the container off screen after width animation is done
  const left = interpolate(
    frame,
    [SCENE_LENGTH_IN_FRAMES, SCENE_LENGTH_IN_FRAMES + 20],
    [0, 100],
    {
      easing: Easing.bezier(0.76, 0, 0.24, 1),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  return (
    <div
      id="container"
      style={{ ...container, width: `${width}%`, left: `${left}%` }}
    ></div>
  );
};
