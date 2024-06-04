import { useMemo } from "react";
import { AbsoluteFill, Series } from "remotion";

import type { BillResult } from "generated";
import { calculateScenes } from "../../utils/calculateScenes";
import HeaderInner from "./components/HeaderInner/HeaderInner";
import SponsorScene from "./components/SponsorScene/SponsorScene";
import SummaryScene from "./components/SummaryScene/SummaryScene";
import TitleScene from "./components/TitleScene/TitleScene";
import VoteScene from "./components/VoteScene/VoteScene";
import LogoScene from "./components/LogoScene";
import WipeIn from "./components/WipeBackground/WipeIn";
import WipeOut from "./components/WipeBackground/WipeOut";

import {
  SCENE_LENGTH_IN_FRAMES,
  SUMMARY_SCENE_LENGTH_IN_FRAMES,
} from "../../types/constants";

import styles from "./LegislationVideo.module.scss";

export const LegislationVideo = ({
  billResult,
}: {
  billResult: BillResult | null;
}) => {
  const content = useMemo(() => {
    if (!billResult) return null;

    const { summaryScenesCount } = calculateScenes(billResult);
    const {
      populistTitle,
      title,
      issueTags,
      legiscanData,
      sponsors,
      status,
      billNumber,
      state,
      session,
    } = billResult;

    const headerInnerProps = {
      title: populistTitle ?? title,
      billNumber: billNumber,
      state: state,
      session: session,
      status: status,
    };

    const summary =
      billResult?.populistSummary ||
      billResult?.description ||
      billResult?.officialSummary ||
      null;

    return (
      <AbsoluteFill style={{ backgroundColor: "var(--black)" }}>
        <Series>
          {title && (
            <Series.Sequence
              name="Title"
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
              name="Summary"
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
              name="Votes"
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
              name="Sponsors"
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
            name="End"
            durationInFrames={SCENE_LENGTH_IN_FRAMES}
            className={styles.legislationVideo}
          >
            <WipeOut />

            <LogoScene />
          </Series.Sequence>
        </Series>
      </AbsoluteFill>
    );
  }, [billResult]);

  return content;
};
