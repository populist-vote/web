import React from "react";
import Image from "next/legacy/image";
import { useCurrentFrame, interpolate, Easing } from "remotion";
import iconYay from "public/images/video-generator/yay-icon.svg";
import iconNay from "public/images/video-generator/nay-icon.svg";
import styles from "./VoteDisplay.module.scss";

const VoteDisplay = ({
  voteTitle,
  numberOfYesVotes,
  numberOfNoVotes,
}: {
  voteTitle: string;
  numberOfYesVotes: number;
  numberOfNoVotes: number;
}) => {
  const totalTime = 80; // total time in frames
  const voteWidthHeight = 1; // height & width of each square
  const columnGap = 0.5; // gap between columns
  const rowGap = 0.5; // gap between rows
  const noColor = "var(--red)"; // color for no votes
  const yesColor = "var(--green-support)"; // color for yes votes
  const totalVotes = numberOfYesVotes + numberOfNoVotes;
  const frame = useCurrentFrame();
  const easingFunction = Easing.bezier(0.22, 1, 0.36, 1); // easeOutQuint
  const squares = new Array(totalVotes).fill(null).map((_, index) => {
    const isGreen = index < numberOfYesVotes;
    const color = isGreen ? yesColor : noColor;
    const delay = (totalTime / totalVotes) * index;
    const opacity = interpolate(frame, [delay, delay + 20], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: easingFunction,
    });

    return (
      <div
        key={index}
        style={{
          width: `${voteWidthHeight}rem`,
          height: `${voteWidthHeight}rem`,
          backgroundColor: color,
          borderRadius: "0.25rem",
          opacity: opacity,
        }}
      />
    );
  });

  return (
    <div className={styles.voteDisplay}>
      <div className={styles.voteHeader}>
        <h2>{voteTitle}</h2>
        <div className={styles.voteIcons}>
          <div className={styles.yesVoteContainer}>
            <Image src={iconYay} alt="Yay Icon" width={60} height={60} />
            <span>{numberOfYesVotes}</span>
          </div>
          <div className={styles.noVoteContainer}>
            <Image src={iconNay} alt="Nay Icon" width={60} height={60} />
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
