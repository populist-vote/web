import { AbsoluteFill, Series } from "remotion";
import { Main } from "./MyComp/Main";
import { Summary } from "./MyComp/Summary";
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
          <Series.Sequence durationInFrames={200}>
            <Main />
          </Series.Sequence>
          <Series.Sequence durationInFrames={200}>
            <Summary />
          </Series.Sequence>
          <Series.Sequence durationInFrames={200}>
            <LastVotes />
          </Series.Sequence>
        </Series>
      </AbsoluteFill>
    </>
  );
};
