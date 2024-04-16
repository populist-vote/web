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
// import { TextFade } from "./TextFade";

const container: React.CSSProperties = {
  backgroundColor: "#002135",
};

// const logo: React.CSSProperties = {
//   justifyContent: "left",
//   alignItems: "center",
// };

const tag: React.CSSProperties = {
  width: "140pt",
  height: "40pt",
  padding: "24pt 14pt",
  borderRadius: "32pt",
  backgroundColor: "#003C55",
  fontFamily: "proximaNovaRegular",
  fontSize: "2.25rem",
  color: "white",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

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
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "left",
            justifyContent: "center",
            padding: "20pt",
          }}
        >
          <h3
            style={{
              fontFamily: "commuterSansLight",
              color: "white",
              fontSize: "3rem",
            }}
          >
            2023 - 2024 SESSION
          </h3>
          <hr
            style={{ border: "1px solid white", opacity: "0.1", width: "100%" }}
          ></hr>
          <h2
            style={{
              fontFamily: "commuterSansLight",
              color: "white",
              fontSize: "4rem",
            }}
          >
            MN - HF 4746
          </h2>

          <h1
            style={{
              fontFamily: "commuterSansSemiBold",
              color: "white",
              fontSize: "8rem",
            }}
          >
            Rideshare Regulations
          </h1>

          <div id="tags" style={{ display: "flex", gap: "8pt" }}>
            <span style={tag}>Tag</span>
            <span style={tag}>Tag</span>
          </div>
        </div>
      </Sequence>
    </AbsoluteFill>
  );
};
