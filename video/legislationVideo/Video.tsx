import React from "react";
import { AbsoluteFill, Series } from "remotion";
import type { BillResult } from "generated";
import HeaderInner from "./components/HeaderInner/HeaderInner";
import VoteDisplay from "./components/VoteDisplay/VoteDisplay";
import SponsorDisplay from "./components/SponsorDisplay/SponsorDisplay";
import TitleScene from "./components/TitleScene/TitleScene";
import SummaryScene from "./components/SummaryScene/SummaryScene";

import Logos from "./components/Logos";
import styles from "./LegislationVideo.module.scss";

export const LegislationVideo = ({
  billResult,
}: {
  billResult: BillResult;
}) => {
  const { populistTitle, title, issueTags, legiscanData, sponsors, status } =
    billResult;

  const headerInnerProps = {
    title: populistTitle ?? title,
    billNumber: billResult.billNumber,
    state: billResult.state,
    session: billResult.session,
    status: status,
  };
  const summary =
    billResult?.populistSummary ||
    billResult?.description ||
    billResult?.officialSummary ||
    "";

  return (
    <AbsoluteFill style={{ backgroundColor: "var(--black)" }}>
      <Series>
        {title && (
          <Series.Sequence
            durationInFrames={240}
            className={styles.legislationVideo}
          >
            <TitleScene
              title={populistTitle || title}
              issueTags={issueTags}
              status={status}
              state={billResult.state ?? undefined}
              billNumber={billResult.billNumber}
              startDate={billResult.session?.startDate}
              endDate={billResult.session?.endDate}
            />
          </Series.Sequence>
        )}
        {summary && (
          <Series.Sequence
            durationInFrames={240}
            className={styles.legislationVideo}
          >
            <div
              style={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <HeaderInner headerProps={headerInnerProps} />
              <SummaryScene summary={summary} />
            </div>
          </Series.Sequence>
        )}

        {legiscanData?.votes && legiscanData.votes.length > 0 && (
          <Series.Sequence
            durationInFrames={240}
            className={styles.legislationVideo}
          >
            <HeaderInner headerProps={headerInnerProps} />
            <VoteDisplay votes={legiscanData?.votes ?? []} />
          </Series.Sequence>
        )}

        {sponsors && sponsors.length > 0 && (
          <Series.Sequence
            durationInFrames={240}
            className={styles.legislationVideo}
          >
            <HeaderInner headerProps={headerInnerProps} />
            <SponsorDisplay sponsors={sponsors} />
          </Series.Sequence>
        )}

        <Series.Sequence
          durationInFrames={240}
          className={styles.legislationVideo}
        >
          <Logos />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
