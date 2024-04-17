import { Sequence } from "remotion";
import React from "react";
import Image from "next/legacy/image";
import { HeaderInner } from "./components/HeaderInner";
import billInConsiderationDark from "public/images/video-generator/bill-status-in-consideration-darkbg.svg";

export const Summary = () => {
  return (
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
        <div style={{ position: "absolute", bottom: "20%", width: "400px" }}>
          <Image
            src={billInConsiderationDark}
            alt="Bill Status: In Consideration"
            layout="responsive"
          />
        </div>
      </div>
    </Sequence>
  );
};
