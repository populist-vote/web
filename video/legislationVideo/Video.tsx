import React from "react";
import { FaCircle } from "react-icons/fa";
import { AbsoluteFill, Series } from "remotion";

import { Badge } from "components/Badge/Badge";
import { PartyAvatar, IssueTags, LegislationStatusBox } from "components";
import { LogoText } from "components/Logo";
import { MPRLogo } from "components/MPRLogo/MPRLogo";
import type {
  BillResult,
  BillStatus,
  IssueTagResult,
  PoliticalParty,
} from "generated";
import { getStatusInfo } from "utils/bill";
import { splitAtDigitAndJoin, titleCase } from "utils/strings";

import { HeaderInner } from "./components/HeaderInner/HeaderInner";
import VoteDisplay from "./components/VoteDisplay";
import legislationVideoStyles from "./LegislationVideo.module.scss";
import styles from "../../pages/bills/BillBySlug.module.scss";
import { default as clsx } from "clsx";

// import { MPRLogo } from "/images/video-generator/MPR-logo.png";

export const LegislationVideo = ({
  billResult,
}: {
  billResult: BillResult;
}) => {
  // console.log(JSON.stringify(billResult, null, 2));
  const statusInfo = getStatusInfo(billResult.status as BillStatus);

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
            className={legislationVideoStyles.legislationVideo}
          >
            <div className={legislationVideoStyles.mainHeader}>
              <h3>2023 - 2024 SESSION</h3>
              <hr></hr>
              <h2>
                {billResult.state || "U.S."} -{" "}
                {splitAtDigitAndJoin(billResult.billNumber)}
              </h2>
            </div>

            <div className={legislationVideoStyles.bottomContainer}>
              <h1>{billResult.populistTitle ?? billResult.title}</h1>
              <div className={legislationVideoStyles.issueTags}>
                {billResult?.issueTags && (
                  <IssueTags tags={billResult.issueTags as IssueTagResult[]} />
                )}
              </div>
              <div className={legislationVideoStyles.statusContainer}>
                <LegislationStatusBox status={billResult.status} />
              </div>
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
            <p>
              {billResult.description ??
                billResult.populistSummary ??
                billResult.officialSummary}
            </p>
            <div className={legislationVideoStyles.bottomContainer}>
              <div className={legislationVideoStyles.badgeContainer}>
                <Badge
                  iconLeft={
                    <FaCircle size={12} color={`var(--${statusInfo?.color})`} />
                  }
                  theme={statusInfo?.color}
                  lightBackground={false}
                  size="large"
                >
                  {titleCase(
                    billResult?.status?.replaceAll("_", " ") as string
                  )}
                </Badge>
              </div>
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
            <h1>Last Votes</h1>

            {lastHouseVote?.yea || lastHouseVote?.nay ? (
              <VoteDisplay
                voteTitle={"HOUSE"}
                numberOfYesVotes={lastHouseVote?.yea ?? 0}
                numberOfNoVotes={lastHouseVote?.nay ?? 0}
              />
            ) : null}

            {lastSenateVote?.yea || lastSenateVote?.nay ? (
              <VoteDisplay
                voteTitle={"SENATE"}
                numberOfYesVotes={lastSenateVote?.yea ?? 0}
                numberOfNoVotes={lastSenateVote?.nay ?? 0}
              />
            ) : null}
            <div className={legislationVideoStyles.bottomContainer}>
              <Badge
                iconLeft={
                  <FaCircle size={12} color={`var(--${statusInfo?.color})`} />
                }
                theme={statusInfo?.color}
                lightBackground={false}
                size="large"
              >
                {titleCase(billResult?.status?.replaceAll("_", " ") as string)}
              </Badge>
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
            {/* 
            
            If billResult.sponsors is less than or equal to 6, display the sponsors in a row, 3 at a time.
            
            If billResult.sponsors is greater than 6, display them in list with only their names, in red or blue, according to their PoliticalParty.
            */}

            {billResult?.sponsors && billResult.sponsors.length > 0 && (
              <div>
                <h1>Sponsors</h1>
                {billResult.sponsors.length <= 6 ? (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "flex-start",
                    }}
                  >
                    {billResult.sponsors.map((sponsor) => (
                      <div
                        key={sponsor.id}
                        className={styles.avatarContainer}
                        style={{ marginRight: "3rem", marginLeft: "0" }}
                      >
                        <PartyAvatar
                          theme={"dark"}
                          isEndorsement={false}
                          iconSize="600px"
                          party={sponsor.party as PoliticalParty}
                          src={sponsor.assets?.thumbnailImage160 as string}
                          alt={`${sponsor.fullName}'s avatar`}
                          badgeSize="3rem"
                          badgeFontSize="2rem"
                          size={240}
                        />
                        <span className={clsx(styles.link, styles.avatarName)}>
                          {sponsor.fullName}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <ul
                    className={`${legislationVideoStyles.sponsorList} ${billResult.sponsors.length > 10 ? legislationVideoStyles.twoColumns : ""}`}
                  >
                    {billResult.sponsors.map((sponsor) => {
                      return (
                        <li
                          key={sponsor.id}
                          style={{
                            color:
                              sponsor.party?.name === "Democratic-Farmer-Labor"
                                ? "var(--blue-text-light)"
                                : "var(--salmon)",
                          }}
                        >
                          {sponsor.fullName}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            )}
            <div className={legislationVideoStyles.bottomContainer}>
              <Badge
                iconLeft={
                  <FaCircle size={12} color={`var(--${statusInfo?.color})`} />
                }
                theme={statusInfo?.color}
                lightBackground={false}
                size="large"
                style={{ scale: "2" }}
              >
                {titleCase(billResult?.status?.replaceAll("_", " ") as string)}
              </Badge>
            </div>
          </Series.Sequence>
          <Series.Sequence
            durationInFrames={200}
            className={legislationVideoStyles.legislationVideo}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                gap: "2rem",
                justifyContent: "center",
              }}
            >
              <div>
                <MPRLogo />
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "1rem" }}
              >
                <span
                  style={{
                    fontSize: "$text-sm",
                    fontStyle: "italic",
                    color: "var(--blue-text-light)",
                  }}
                >
                  Powered by
                </span>
                <div style={{ width: "14rem" }}>
                  <LogoText />
                </div>
              </div>
            </div>
          </Series.Sequence>
        </Series>
      </AbsoluteFill>
    </>
  );
};
