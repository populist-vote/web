import React, { useState, useEffect } from "react";
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
  onFrameCount,
}: {
  billResult: BillResult;
  onFrameCount?: (frameCount: number) => void;
}) => {
  const [totalFrames, setTotalFrames] = useState(0);

  const handleTotalFrames = (frames: number) => {
    setTotalFrames(frames);
    if (onFrameCount) {
      onFrameCount(numberOfInnerSequenceFrames);
    }
  };

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

  // Calculate the number of inner sequences
  const [numberOfInnerSequenceFrames] = useState(() => {
    let frames = 0;
    if (summary) frames += 240;
    if (legiscanData?.votes && legiscanData.votes.length > 0)
      frames += 240 * totalFrames;
    if (sponsors && sponsors.length > 0) frames += 240;
    return frames;
  });

  // Ensure to call onFrameCount when numberOfInnerSequenceFrames is calculated
  useEffect(() => {
    if (onFrameCount) {
      onFrameCount(numberOfInnerSequenceFrames);
    }
  }, [numberOfInnerSequenceFrames]);

  return (
    <AbsoluteFill style={{ backgroundColor: "var(--black)" }}>
      <Series>
        {title && (
          <Series.Sequence
            durationInFrames={240}
            className={styles.legislationVideo}
          >
            <h1>{numberOfInnerSequenceFrames}</h1>
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
            durationInFrames={totalFrames > 0 ? totalFrames : 240} // Use a default minimum duration
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
              <SummaryScene
                summary={summary}
                onTotalFrames={handleTotalFrames}
              />
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