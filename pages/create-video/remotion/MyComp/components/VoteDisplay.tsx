import React from "react";

const VoteDisplay = ({
  redcolor,
  greencolor,
  numberOfYesVotes,
  numberOfNoVotes,
  voteWidthHeight,
  columnGap,
  rowGap,
}: {
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
        }}
      />
    );
  });

  return (
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
  );
};

export default VoteDisplay;
