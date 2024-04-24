import React from "react";
import { AbsoluteFill, Series } from "remotion";

import { IssueTags, LegislationStatusBox } from "components";

import type { BillResult, IssueTagResult } from "generated";
import { splitAtDigitAndJoin } from "utils/strings";

import { HeaderInner } from "./components/HeaderInner/HeaderInner";
import VoteDisplay from "./components/VoteDisplay";
import SponsorDisplay from "./components/SponsorDisplay";
import StatusBadge from "./components/StatusBadge";
import Logos from "./components/Logos";
import styles from "./LegislationVideo.module.scss";

export const LegislationVideo = ({
  billResult,
}: {
  billResult: BillResult;
}) => {
  const headerInnerProps = {
    title: billResult.populistTitle ?? billResult.title,
    billNumber: billResult.billNumber,
    state: billResult.state,
    session: billResult.session,
  };
  const lastHouseVote = billResult.legiscanData?.votes
    ?.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .filter((vote) => vote.chamber === "H")
    .slice(-1)
    .pop();

  const lastSenateVote = billResult.legiscanData?.votes
    ?.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .filter((vote) => vote.chamber === "S")
    .slice(-1)
    .pop();

  return (
    <>
      <AbsoluteFill style={{ backgroundColor: "var(--black)" }}>
        <Series>
          <Series.Sequence
            durationInFrames={200}
            className={styles.legislationVideo}
          >
            <div className={styles.mainHeader}>
              <h3>2023 - 2024 SESSION</h3>
              <hr></hr>
              <h2>
                {billResult.state || "U.S."} -{" "}
                {splitAtDigitAndJoin(billResult.billNumber)}
              </h2>
            </div>

            <div className={styles.bottomContainer}>
              <h1>{billResult.populistTitle ?? billResult.title}</h1>
              <div className={styles.issueTags}>
                {billResult?.issueTags && (
                  <IssueTags tags={billResult.issueTags as IssueTagResult[]} />
                )}
              </div>
              <div className={styles.statusContainer}>
                <LegislationStatusBox status={billResult.status} />
              </div>
            </div>
          </Series.Sequence>
          <Series.Sequence
            durationInFrames={200}
            className={styles.legislationVideo}
          >
            <HeaderInner headerProps={headerInnerProps} />
            <p>
              {billResult.description ??
                billResult.populistSummary ??
                billResult.officialSummary}
            </p>
            <StatusBadge status={billResult?.status} />
          </Series.Sequence>
          <Series.Sequence
            durationInFrames={200}
            className={styles.legislationVideo}
          >
            <HeaderInner headerProps={headerInnerProps} />
            <h1>Last Votes</h1>

            {lastHouseVote?.yea || lastHouseVote?.nay ? (
              <VoteDisplay
                voteTitle={"HOUSE"}
                numberOfYesVotes={lastHouseVote?.yea ?? 0}
                numberOfNoVotes={lastHouseVote?.nay ?? 0}
              />
            ) : (
              <></>
            )}

            {lastSenateVote?.yea || lastSenateVote?.nay ? (
              <VoteDisplay
                voteTitle={"SENATE"}
                numberOfYesVotes={lastSenateVote?.yea ?? 0}
                numberOfNoVotes={lastSenateVote?.nay ?? 0}
              />
            ) : (
              <></>
            )}
            <StatusBadge status={billResult?.status} />
          </Series.Sequence>
          <Series.Sequence
            durationInFrames={200}
            className={styles.legislationVideo}
          >
            <HeaderInner headerProps={headerInnerProps} />

            <SponsorDisplay sponsors={billResult.sponsors} />

            <StatusBadge status={billResult?.status} />
          </Series.Sequence>
          <Series.Sequence
            durationInFrames={200}
            className={styles.legislationVideo}
          >
            <Logos />
          </Series.Sequence>
        </Series>
      </AbsoluteFill>
    </>
  );
};
