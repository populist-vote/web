import { AbsoluteFill, Sequence } from "remotion";
import React from "react";
import { HeaderInner } from "./components/HeaderInner";

export const Summary = () => {
  return (
    <AbsoluteFill>
      <Sequence>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "left",
            justifyContent: "top",
            padding: "8rem 4rem", // 120pt 40pt
            gap: "4rem",
            width: "100%",
          }}
        >
          <HeaderInner />
          <p
            id="summaryText"
            style={{
              fontFamily: "proxima_nova",
              fontSize: "3.5rem",
              fontWeight: "400",
              lineHeight: "1.5",
            }}
          >
            This bill aims to regulate transportation network companies by
            defining terms, establishing insurance requirements, and protecting
            drivers and riders.
          </p>
        </div>
      </Sequence>
    </AbsoluteFill>
  );
};
