import React from "react";
import { AbsoluteFill, Series } from "remotion";
import { IssueTags, LegislationStatusBox } from "components";
import type { BillResult, IssueTagResult } from "generated";
import { splitAtDigitAndJoin } from "utils/strings";
import HeaderInner from "./components/HeaderInner/HeaderInner";
import VoteDisplay from "./components/VoteDisplay/VoteDisplay";
import SponsorDisplay from "./components/SponsorDisplay/SponsorDisplay";
import Logos from "./components/Logos";
import { AnimatedDivider } from "./components/AnimatedDivider";
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
    status: status,
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
          <div className={styles.mainHeader}>
            <div className={styles.topContainer}>
              <Animated
                animations={[
                  Move({ y: 0, initialY: 30 }),
                  Fade({ to: 1, initial: 0 }),
                ]}
                delay={20}
                style={{ opacity: 0 }}
              >
                <h3>2023 - 2024 SESSION</h3>
              </Animated>
            </div>

            <div className={styles.middleContainer}>
              <AnimatedDivider />
            </div>
            <Animated
              animations={[
                Move({ y: 0, initialY: 30 }),
                Fade({ to: 1, initial: 0 }),
              ]}
              delay={40}
              style={{ opacity: 0 }}
            >
              <h2>
                {billResult.state || "U.S."} -{" "}
                {splitAtDigitAndJoin(billResult.billNumber)}
              </h2>
            </Animated>
          </div>
          <div className={styles.bottomContainer}>
            <Animated
              animations={[
                Move({ y: 0, initialY: 30 }),
                Fade({ to: 1, initial: 0 }),
              ]}
              style={{ opacity: 0 }}
              delay={60}
            >
              <h1>{populistTitle || title}</h1>
            </Animated>

            {issueTags && issueTags.length > 0 ? (
              <Animated
                animations={[
                  Move({ y: 0, initialY: 30 }),
                  Fade({ to: 1, initial: 0 }),
                ]}
                style={{ opacity: 0 }}
                delay={80}
              >
                <div className={styles.issueTagsContainer}>
                  <IssueTags tags={issueTags as IssueTagResult[]} />
                </div>{" "}
              </Animated>
            ) : (
              <></>
            )}
            <Animated
              animations={[
                Move({ y: 0, initialY: 30 }),
                Fade({ to: 1, initial: 0 }),
              ]}
              delay={100}
              style={{ opacity: 0 }}
            >
              <div className={styles.legislationStatusContainer}>
                <LegislationStatusBox status={status} />
              </div>
            </Animated>
          </div>
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
