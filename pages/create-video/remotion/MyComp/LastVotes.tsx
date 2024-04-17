import { AbsoluteFill, Sequence } from "remotion";
import React from "react";
import { HeaderInner } from "./components/HeaderInner";
import VoteDisplay from "./components/VoteDisplay";

export const LastVotes = () => {
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
          <h1
            style={{
              color: "white",
              fontSize: "6rem",
              fontWeight: "600",
              margin: "10rem 0 0 0",
            }}
          >
            Last Votes
          </h1>
          <VoteDisplay
            redcolor="#ff4444"
            greencolor="#44ff44"
            numberOfYesVotes={40}
            numberOfNoVotes={25}
            voteWidthHeight={1}
            columnGap={1}
            rowGap={1}
          />
        </div>
      </Sequence>
    </AbsoluteFill>
  );
};
