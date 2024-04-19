import { AbsoluteFill, Series } from "remotion";
// import { Main } from "./Main";
// import { Summary } from "./Summary";
// import { LastVotes } from "./LastVotes";
// import { Sponsors } from "./Sponsors";
import { HeaderInner } from "./components/HeaderInner/HeaderInner";
import type { BillResult } from "generated";

export const LegislationVideo = ({ billData }: { billData: BillResult }) => {
  return (
    <>
      <AbsoluteFill>
        <Series>
          {/* <Series.Sequence durationInFrames={200}>
            <Main />
          </Series.Sequence>
          <Series.Sequence durationInFrames={200}>
            <HeaderInner
              billTitle={billData.populistTitle ?? billData.title}
              billNumber={billData.billNumber}
              billState={billData.state}
              billSession={billData.session}
            />
            <Summary />
          </Series.Sequence>
          <Series.Sequence durationInFrames={200}>
            <HeaderInner
              billTitle={billData.populistTitle ?? billData.title}
              billNumber={billData.billNumber}
              billState={billData.state}
              billSession={billData.session}
            />
            <LastVotes />
          </Series.Sequence> */}
          <Series.Sequence durationInFrames={Infinity}>
            <HeaderInner
              billTitle={billData.populistTitle ?? billData.title}
              billNumber={billData.billNumber}
              billState={billData.state}
              billSession={billData.session}
            />
          </Series.Sequence>
        </Series>
      </AbsoluteFill>
    </>
  );
};
