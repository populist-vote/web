import { z } from "zod";
import "../load-fonts";

import {
  AbsoluteFill,
  Sequence,
  // spring,
  // useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { CompositionProps } from "../../types/constants";
import React from "react";
import { TextFade } from "./TextFade";

const container: React.CSSProperties = {
  backgroundColor: "#002135",
};

// const logo: React.CSSProperties = {
//   justifyContent: "left",
//   alignItems: "center",
// };

export const Main = ({}: z.infer<typeof CompositionProps>) => {
  // const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const transitionStart = 2 * fps;
  const transitionDuration = 1 * fps;

  // const logoOut = spring({
  //   fps,
  //   frame,
  //   config: { damping: 200 },
  //   durationInFrames: transitionDuration,
  //   delay: transitionStart,
  // });

  return (
    <AbsoluteFill style={container}>
      <Sequence durationInFrames={transitionStart + transitionDuration}>
        <TextFade>
          <h1
            style={{
              fontFamily: "commuterSansLight",
              color: "white",
              fontSize: "8rem",
            }}
          >
            Rideshare Regulations
          </h1>
        </TextFade>
      </Sequence>
    </AbsoluteFill>
  );
};
