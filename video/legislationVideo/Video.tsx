import React from "react";
import { AbsoluteFill, Series } from "remotion";
import { IssueTags, LegislationStatusBox } from "components";
import type { BillResult, IssueTagResult } from "generated";
import { splitAtDigitAndJoin } from "utils/strings";
import HeaderInner from "./components/HeaderInner/HeaderInner";
import VoteDisplay from "./components/VoteDisplay";
import SponsorDisplay from "./components/SponsorDisplay";
import StatusBadge from "./components/StatusBadge";
import Logos from "./components/Logos";
import styles from "./LegislationVideo.module.scss";
import { Animated, Fade, Move } from "remotion-animated";

interface Vote {
  date: string;
  chamber: string;
  yea: number;
  nay: number;
}
const getLastVote = (votes: Vote[], chamber: string): Vote | undefined =>
  votes
    ?.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .find((vote) => vote.chamber === chamber);

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
  };

  const lastHouseVote = getLastVote(legiscanData?.votes ?? [], "H");
  const lastSenateVote = getLastVote(legiscanData?.votes ?? [], "S");

  return (
    <AbsoluteFill style={{ backgroundColor: "var(--black)" }}>
      <Series>
        <Series.Sequence
          durationInFrames={200}
          className={styles.legislationVideo}
        >
          <div className={styles.mainHeader}>
            <Animated animations={[Move({ y: 40 }), Fade({ to: 0 })]}>
              <h3>2023 - 2024 SESSION</h3>
            </Animated>
            <hr />
            <h2>
              {billResult.state || "U.S."} -{" "}
              {splitAtDigitAndJoin(billResult.billNumber)}
            </h2>
          </div>
          <div className={styles.bottomContainer}>
            <h1>{populistTitle || title}</h1>
            {issueTags && <IssueTags tags={issueTags as IssueTagResult[]} />}
            <LegislationStatusBox status={status} />
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
          <StatusBadge status={status} />
        </Series.Sequence>

        <Series.Sequence
          durationInFrames={200}
          className={styles.legislationVideo}
        >
          <HeaderInner headerProps={headerInnerProps} />
          <h1>Last Votes</h1>
          {lastHouseVote && (
            <VoteDisplay
              voteTitle="HOUSE"
              numberOfYesVotes={lastHouseVote.yea ?? 0}
              numberOfNoVotes={lastHouseVote.nay ?? 0}
            />
          )}
          {lastSenateVote && (
            <VoteDisplay
              voteTitle="SENATE"
              numberOfYesVotes={lastSenateVote.yea ?? 0}
              numberOfNoVotes={lastSenateVote.nay ?? 0}
            />
          )}
          <StatusBadge status={status} />
        </Series.Sequence>

        <Series.Sequence
          durationInFrames={200}
          className={styles.legislationVideo}
        >
          <HeaderInner headerProps={headerInnerProps} />
          <SponsorDisplay sponsors={sponsors} />
          <StatusBadge status={status} />
        </Series.Sequence>

        <Series.Sequence
          durationInFrames={200}
          className={styles.legislationVideo}
        >
          <Logos />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
