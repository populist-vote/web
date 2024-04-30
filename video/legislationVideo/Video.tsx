import { AbsoluteFill, Series } from "remotion";
import type { BillResult } from "generated";
import HeaderInner from "./components/HeaderInner/HeaderInner";
import VoteScene from "./components/VoteScene/VoteScene";
import SponsorScene from "./components/SponsorScene/SponsorScene";
import TitleScene from "./components/TitleScene/TitleScene";
import SummaryScene from "./components/SummaryScene/SummaryScene";
import WipeOut from "./components/WipeBackground/WipeOut";
import WipeIn from "./components/WipeBackground/WipeIn";

import {
  SCENE_LENGTH_IN_FRAMES,
  SUMMARY_SCENE_LENGTH_IN_FRAMES,
} from "types/constants";

import Logos from "./components/Logos";
import styles from "./LegislationVideo.module.scss";

export const LegislationVideo = ({
  billResult,
  summaryScenesCount,
  summary,
}: {
  billResult: BillResult;
  summaryScenesCount: number;
  summary: string | null;
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

  return (
    <AbsoluteFill style={{ backgroundColor: "var(--black)" }}>
      <Series>
        {title && (
          <Series.Sequence
            durationInFrames={SCENE_LENGTH_IN_FRAMES}
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
            <WipeIn />
          </Series.Sequence>
        )}
        {summary && (
          <Series.Sequence
            durationInFrames={
              SUMMARY_SCENE_LENGTH_IN_FRAMES * summaryScenesCount
            }
            className={styles.legislationVideo}
          >
            <WipeOut />
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
            <WipeIn
              delay={SUMMARY_SCENE_LENGTH_IN_FRAMES * summaryScenesCount}
            />
          </Series.Sequence>
        )}

        {legiscanData?.votes && legiscanData.votes.length > 0 && (
          <Series.Sequence
            durationInFrames={SCENE_LENGTH_IN_FRAMES}
            className={styles.legislationVideo}
          >
            <WipeOut />

            <HeaderInner headerProps={headerInnerProps} />
            <VoteScene votes={legiscanData?.votes ?? []} />
            <WipeIn />
          </Series.Sequence>
        )}

        {sponsors && sponsors.length > 0 && (
          <Series.Sequence
            durationInFrames={SCENE_LENGTH_IN_FRAMES}
            className={styles.legislationVideo}
          >
            <WipeOut />

            <HeaderInner headerProps={headerInnerProps} />
            <SponsorScene sponsors={sponsors} />
            <WipeIn />
          </Series.Sequence>
        )}

        <Series.Sequence
          durationInFrames={SCENE_LENGTH_IN_FRAMES}
          className={styles.legislationVideo}
        >
          <WipeOut />

          <Logos />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
