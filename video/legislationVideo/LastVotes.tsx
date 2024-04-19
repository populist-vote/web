import { Sequence } from "remotion";
import React from "react";
import Image from "next/legacy/image";
import VoteDisplay from "./components/VoteDisplay";
import billInConsiderationDark from "public/images/video-generator/bill-status-in-consideration-darkbg.svg";

export const LastVotes = () => {
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
          voteTitle="HOUSE"
          numberOfYesVotes={100}
          numberOfNoVotes={20}
        />
        <VoteDisplay
          voteTitle="SENATE"
          numberOfYesVotes={34}
          numberOfNoVotes={5}
        />
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
