import React from "react";
import Image from "next/legacy/image";
import iconYay from "public/images/video-generator/yay-icon.svg";
import iconNay from "public/images/video-generator/nay-icon.svg";

const VoteDisplay = ({
  voteTitle,
  numberOfYesVotes,
  numberOfNoVotes,
}: {
  voteTitle: string;
  numberOfYesVotes: number;
  numberOfNoVotes: number;
}) => {
  const voteWidthHeight = 1; // height & width of each square
  const columnGap = 0.5; // gap between columns
  const rowGap = 0.5; // gap between rows
  const noColor = "var(--red)"; // color for no votes
  const yesColor = "var(--green-support)"; // color for yes votes
  const totalVotes = numberOfYesVotes + numberOfNoVotes;
  const squares = new Array(totalVotes).fill(null).map((_, index) => {
    const isGreen = index < numberOfYesVotes;
    const color = isGreen ? yesColor : noColor;
    return (
      <div
        key={index}
        style={{
          width: `${voteWidthHeight}rem`,
          height: `${voteWidthHeight}rem`,
          backgroundColor: color,
          borderRadius: "0.25rem",
        }}
      />
    );
  });

  return (
    <div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>{voteTitle}</h2>
        <div
          style={{
            display: "flex",
            fontFamily: "proxima_nova",
            fontWeight: "600",
            fontSize: "3rem",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              marginRight: "2rem",
            }}
          >
            <span style={{ width: "60px", marginRight: "1rem" }}>
              <Image src={iconYay} alt="Yay Icon" layout="responsive" />
            </span>
            <span>{numberOfYesVotes}</span>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <span style={{ width: "60px", marginRight: "1rem" }}>
              <Image src={iconNay} alt="Nay Icon" layout="responsive" />
            </span>
            <span>{numberOfNoVotes}</span>
          </div>
        </div>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(auto-fill, minmax(${voteWidthHeight}rem, 1fr))`,
          gridColumnGap: `${columnGap}rem`,
          gridRowGap: `${rowGap}rem`,
          width: "100%",
        }}
      >
        {squares}
      </div>
    </div>
  );
};

export default VoteDisplay;
