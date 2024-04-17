import { z } from "zod";
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

const tag: React.CSSProperties = {
  width: "140pt",
  height: "40pt",
  padding: "24pt 14pt",
  borderRadius: "32pt",
  backgroundColor: "#003C55",
  fontFamily: "proxima_nova",
  fontSize: "2.25rem",
  color: "white",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const bigTag: React.CSSProperties = {
  width: "48rem", // 270pt
  height: "12rem", // 68pt
  padding: "1.25rem 1.875rem", // 20pt 30pt
  borderRadius: "3.75rem",
  border: "4px solid #FFB45C",
  backgroundColor: "rgba(255, 180, 92, 0.1)", // 10% opacity
  fontFamily: "commuter_sans",
  fontSize: "4rem",
  color: "white",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.3)",
};

//Introduced: Uses Violet color
//In Consideration: Uses Orange color
//Became Law: Uses Green color

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
            justifyContent: "top",
            padding: "8rem 4rem", // 120pt 40pt
            gap: "4rem",
          }}
        >
          <div id="header" style={{}}>
            <h3
              style={{
                color: "white",
                fontSize: "2.5rem",
                margin: "2rem 0",
              }}
            >
              2023 - 2024 SESSION
            </h3>
            <hr
              style={{
                border: "1px solid white",
                opacity: "0.1",
                width: "100%",
              }}
            ></hr>
            <h2
              style={{
                color: "white",
                fontSize: "3rem",
                margin: "2rem 0",
              }}
            >
              MN - HF 4746
            </h2>
          </div>
          <h1
            style={{
              color: "white",
              fontSize: "8rem",
              margin: "30rem 0 0 0",
            }}
          >
            Rideshare Regulations
          </h1>

          <div
            id="tags"
            style={{ display: "flex", gap: "8pt", marginBottom: "2rem" }}
          >
            <span style={tag}>Tag</span>
            <span style={tag}>Tag</span>
          </div>

          <div style={bigTag}>In Consideration</div>
        </div>
      </Sequence>
    </AbsoluteFill>
  );
};
