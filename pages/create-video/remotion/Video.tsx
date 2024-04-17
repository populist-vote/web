import { AbsoluteFill, Series } from "remotion";
// import { Main } from "./MyComp/Main";
// import { Summary } from "./MyComp/Summary";
import { LastVotes } from "./MyComp/LastVotes";

export const RemotionVideo: React.FC = () => {
  return (
    <>
      <AbsoluteFill
        style={{
          backgroundColor: "var(--background-primary)",
        }}
      >
        <Series>
          {/* <Series.Sequence durationInFrames={200}>
            <Main />
          </Series.Sequence> */}
          {/* <Series.Sequence durationInFrames={Infinity}>
            <Summary />
          </Series.Sequence> */}
          <Series.Sequence durationInFrames={Infinity}>
            <LastVotes />
          </Series.Sequence>
        </Series>
      </AbsoluteFill>
    </>
  );
};
