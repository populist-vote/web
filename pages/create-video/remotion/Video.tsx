import { AbsoluteFill, Series } from "remotion";
// import { Main } from "./MyComp/Main";
import { Summary } from "./MyComp/Summary";

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
          <Series.Sequence durationInFrames={Infinity}>
            <Summary />
          </Series.Sequence>
        </Series>
      </AbsoluteFill>
    </>
  );
};
