import React from "react";

const VoteDisplay = ({
  voteTitle,
  redcolor,
  greencolor,
  numberOfYesVotes,
  numberOfNoVotes,
  voteWidthHeight,
  columnGap,
  rowGap,
}: {
  voteTitle: string;
  redcolor: string;
  greencolor: string;
  numberOfYesVotes: number;
  numberOfNoVotes: number;
  voteWidthHeight: number;
  columnGap: number;
  rowGap: number;
}) => {
  const totalVotes = numberOfYesVotes + numberOfNoVotes;
  const squares = new Array(totalVotes).fill(null).map((_, index) => {
    const isGreen = index < numberOfYesVotes;
    const color = isGreen ? greencolor : redcolor;
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
        <h2
          style={{
            fontSize: "2.5rem",
            fontWeight: "400",
          }}
        >
          {voteTitle}
        </h2>
        <div
          style={{
            display: "flex",
            fontFamily: "proxima_nova",
            fontWeight: "600",
            fontSize: "3rem",
            gap: "1rem",
          }}
        >
          <div>{numberOfYesVotes}</div>
          <div>{numberOfNoVotes}</div>
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
