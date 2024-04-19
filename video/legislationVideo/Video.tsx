import { AbsoluteFill, Series } from "remotion";
import VoteDisplay from "./components/VoteDisplay";
import { HeaderInner } from "./components/HeaderInner/HeaderInner";
import type { BillResult } from "generated";
import Image from "next/legacy/image";
import billInConsiderationDark from "public/images/video-generator/bill-status-in-consideration-darkbg.svg";
import { Candidate, ColoredSection } from "components";

import { PoliticianResult } from "generated";

import styles from "../../pages/bills/BillBySlug.module.scss";
import legislationVideoStyles from "./LegislationVideo.module.scss";

export const LegislationVideo = ({
  billResult,
}: {
  billResult: BillResult;
}) => {
  // console.log(JSON.stringify(billResult, null, 2));
  return (
    <>
      <AbsoluteFill style={{ backgroundColor: "var(--black)" }}>
        <Series>
          <Series.Sequence
            durationInFrames={200}
            className={legislationVideoStyles.legislationVideo}
          >
            <div id="header" className={legislationVideoStyles.mainHeader}>
              <h3>2023 - 2024 SESSION</h3>
              <hr></hr>
              <h2>MN - HF 4746</h2>
            </div>

            <h1>Rideshare Regulations</h1>

            <div
              id="tags"
              style={{ display: "flex", gap: "8pt", marginBottom: "2rem" }}
            >
              <span className={legislationVideoStyles.tag}>Tag</span>
              <span className={legislationVideoStyles.tag}>Tag</span>
            </div>
            <div className={legislationVideoStyles.bigTag}>
              In Consideration
            </div>
          </Series.Sequence>
          <Series.Sequence
            durationInFrames={200}
            className={legislationVideoStyles.legislationVideo}
          >
            <HeaderInner
              billTitle={billResult.populistTitle ?? billResult.title}
              billNumber={billResult.billNumber}
              billState={billResult.state}
              billSession={billResult.session}
            />
            <p
              style={{
                fontFamily: "proxima_nova",
                fontSize: "3.5rem",
                fontWeight: "400",
                lineHeight: "1.5",
              }}
            >
              {billResult.populistSummary ?? billResult.officialSummary}
              This bill aims to regulate transportation network companies by
              defining terms, establishing insurance requirements, and
              protecting drivers and riders.
            </p>
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
          <Series.Sequence
            durationInFrames={200}
            className={legislationVideoStyles.legislationVideo}
          >
            <HeaderInner
              billTitle={billResult.populistTitle ?? billResult.title}
              billNumber={billResult.billNumber}
              billState={billResult.state}
              billSession={billResult.session}
            />
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
          <Series.Sequence
            durationInFrames={200}
            className={legislationVideoStyles.legislationVideo}
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
        </Series>
      </AbsoluteFill>
    </>
  );
};
