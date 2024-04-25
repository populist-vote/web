import React from "react";
import { useCurrentFrame } from "remotion";

export const AnimatedDivider = () => {
  const frame = useCurrentFrame();
  const width = `${Math.min(100, (frame / 30) * 100)}%`;
  return <hr style={{ width: width, marginLeft: 0 }} />;
};
