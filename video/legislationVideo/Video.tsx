import { AbsoluteFill, Series } from "remotion";
// import { Main } from "./Main";
// import { Summary } from "./Summary";
// import { LastVotes } from "./LastVotes";
// import { Sponsors } from "./Sponsors";
import { HeaderInner } from "./components/HeaderInner/HeaderInner";
import type { BillResult } from "generated";
import Image from "next/legacy/image";
import billInConsiderationDark from "public/images/video-generator/bill-status-in-consideration-darkbg.svg";
import { Candidate, ColoredSection } from "components";

import { PoliticianResult } from "generated";

import styles from "../../pages/bills/BillBySlug.module.scss";

export const LegislationVideo = ({
  billResult,
  // sponsors,
}: {
  billResult: BillResult;
}) => {
  // console.log("LegislationVideo billdata:", JSON.stringify(billData, null, 2));
  return (
    <>
      <AbsoluteFill>
        <Series>
          <Series.Sequence
            durationInFrames={Infinity}
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
            <HeaderInner
              billTitle={billResult.populistTitle ?? billResult.title}
              billNumber={billResult.billNumber}
              billState={billResult.state}
              billSession={billResult.session}
            />
            {billResult?.sponsors && billResult.sponsors.length > 0 && (
              <ColoredSection color="var(--blue)">
                <h2 className={styles.gradientHeader}>Sponsors</h2>
                <div className={styles.sponsorsWrapper}>
                  {billResult.sponsors.map((sponsor) => (
                    <Candidate
                      key={sponsor.id}
                      itemId={sponsor.id}
                      candidate={sponsor as PoliticianResult}
                    />
                  ))}
                </div>
              </ColoredSection>
            )}
            {/* <Sponsors /> */}
            <div
              style={{ position: "absolute", bottom: "20%", width: "400px" }}
            >
              <Image
                src={billInConsiderationDark}
                alt="Bill Status: In Consideration"
                layout="responsive"
              />
            </div>
          </Series.Sequence>
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
        </Series>
      </AbsoluteFill>
    </>
  );
};
