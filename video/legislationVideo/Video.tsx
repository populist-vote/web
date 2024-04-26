import React from "react";
import { AbsoluteFill, Series } from "remotion";
import type { BillResult } from "generated";
import HeaderInner from "./components/HeaderInner/HeaderInner";
import VoteDisplay from "./components/VoteDisplay/VoteDisplay";
import SponsorDisplay from "./components/SponsorDisplay/SponsorDisplay";
import TitleScene from "./components/TitleScene/TitleScene";
import Logos from "./components/Logos";
import styles from "./LegislationVideo.module.scss";

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
    status: status,
  };

  const titleSceneProps = {
    title: populistTitle || title,
    issueTags: issueTags,
    status: status,
    state: billResult.state ?? undefined,
    billNumber: billResult.billNumber,
  };

  // console.log(JSON.stringify(populistTitle, null, 2));
  const lastHouseVote = getLastVote(legiscanData?.votes ?? [], "H");
  const lastSenateVote = getLastVote(legiscanData?.votes ?? [], "S");

  return (
    <AbsoluteFill style={{ backgroundColor: "var(--black)" }}>
      <Series>
        <Series.Sequence
          durationInFrames={200}
          className={styles.legislationVideo}
        >
          <TitleScene titleProps={titleSceneProps} />
        </Series.Sequence>

        <Series.Sequence
          durationInFrames={200}
          className={styles.legislationVideo}
        >
          <HeaderInner headerProps={headerInnerProps} />
          <div className={styles.bottomContainer}>
            <p>
              {billResult.description ??
                billResult.populistSummary ??
                billResult.officialSummary}
            </p>
          </div>
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
        </Series.Sequence>

        <Series.Sequence
          durationInFrames={200}
          className={styles.legislationVideo}
        >
          <HeaderInner headerProps={headerInnerProps} />
          <SponsorDisplay sponsors={sponsors} />
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
