import { AbsoluteFill, Series } from "remotion";
import type { BillResult, PoliticianResult } from "generated";
import HeaderInner from "./components/HeaderInner/HeaderInner";
import VoteDisplay from "./components/VoteDisplay/VoteDisplay";
import SponsorDisplay from "./components/SponsorDisplay/SponsorDisplay";
import TitleScene from "./components/TitleScene/TitleScene";
import SummaryScene from "./components/SummaryScene/SummaryScene";
import { SCENE_LENGTH_IN_FRAMES } from "types/constants";

import Logos from "./components/Logos";
import styles from "./LegislationVideo.module.scss";

function calculateScenes(
  summary: string | null,
  billResult: BillResult["legiscanData"],
  sponsors: PoliticianResult[]
) {
  let totalInnerScenes = 0;
  let summaryScenes = 0;

  if (summary) {
    const sentences = summary.match(/[^\.!\?]+[\.!\?]+/g) || [];
    const parts = [];
    let currentPart = "";

    sentences.forEach((sentence) => {
      if ((currentPart + sentence).split(" ").length > 30) {
        parts.push(currentPart.trim());
        currentPart = sentence;
      } else {
        currentPart += " " + sentence;
      }
    });

    if (currentPart) {
      parts.push(currentPart.trim());
    }

    summaryScenes = parts.length;
    totalInnerScenes += summaryScenes;
  }

  if (billResult?.votes && billResult.votes.length > 0) totalInnerScenes += 1;
  if (sponsors && sponsors.length > 0) totalInnerScenes += 1;

  return {
    totalInnerScenesCount: totalInnerScenes,
    summaryScenesCount: summaryScenes,
  };
}
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
    null;

  const { totalInnerScenesCount, summaryScenesCount } = calculateScenes(
    summary,
    billResult.legiscanData,
    sponsors
  );

  console.log("totalInnerScenesCount:", totalInnerScenesCount);
  console.log("summaryScenesCount:", summaryScenesCount);
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
          </Series.Sequence>
        )}
        {summary && (
          <Series.Sequence
            durationInFrames={SCENE_LENGTH_IN_FRAMES * 4}
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
            durationInFrames={SCENE_LENGTH_IN_FRAMES}
            className={styles.legislationVideo}
          >
            <HeaderInner headerProps={headerInnerProps} />
            <VoteDisplay votes={legiscanData?.votes ?? []} />
          </Series.Sequence>
        )}

        {sponsors && sponsors.length > 0 && (
          <Series.Sequence
            durationInFrames={SCENE_LENGTH_IN_FRAMES}
            className={styles.legislationVideo}
          >
            <HeaderInner headerProps={headerInnerProps} />
            <SponsorDisplay sponsors={sponsors} />
          </Series.Sequence>
        )}

        <Series.Sequence
          durationInFrames={SCENE_LENGTH_IN_FRAMES}
          className={styles.legislationVideo}
        >
          <Logos />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
