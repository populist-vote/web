import { AbsoluteFill, Series } from "remotion";
import VoteDisplay from "./components/VoteDisplay";
import { Badge } from "components/Badge/Badge";
import { FaCircle } from "react-icons/fa";
import { HeaderInner } from "./components/HeaderInner/HeaderInner";
import type { BillResult, BillStatus } from "generated";
import {
  Candidate,
  ColoredSection,
  IssueTags,
  LegislationStatusBox,
} from "components";

import { PoliticianResult, IssueTagResult } from "generated";

import styles from "../../pages/bills/BillBySlug.module.scss";
import legislationVideoStyles from "./LegislationVideo.module.scss";
import { splitAtDigitAndJoin, titleCase } from "utils/strings";
import React from "react";
import { getStatusInfo } from "utils/bill";

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
            <div id="header" className={legislationVideoStyles.mainHeader}>
              <h3>2023 - 2024 SESSION</h3>
              <hr></hr>
              <h2>
                {billResult.state || "U.S."} -{" "}
                {splitAtDigitAndJoin(billResult.billNumber)}
              </h2>
            </div>
            <h1> {billResult.populistTitle ?? billResult.title}</h1>

            {billResult?.issueTags && (
              <IssueTags tags={billResult.issueTags as IssueTagResult[]} />
            )}
            <LegislationStatusBox status={billResult.status} />
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
            <p
              style={{
                fontFamily: "proxima_nova",
                fontSize: "3.5rem",
                fontWeight: "400",
                lineHeight: "1.5",
              }}
            >
              {billResult.description ??
                billResult.populistSummary ??
                billResult.officialSummary}
            </p>
            <div
              style={{ position: "absolute", bottom: "20%", width: "400px" }}
            >
              <Badge
                iconLeft={
                  <FaCircle size={12} color={`var(--${statusInfo?.color})`} />
                }
                theme={statusInfo?.color}
                darkBackground
                size="small"
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
            <h1
              style={{
                color: "white",
                fontSize: "6rem",
                fontWeight: "600",
                margin: "10rem 0 0 0",
              }}
            >
              Last Votes
            </h1>

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

            <div
              style={{ position: "absolute", bottom: "20%", width: "400px" }}
            >
              <Badge
                iconLeft={
                  <FaCircle size={12} color={`var(--${statusInfo?.color})`} />
                }
                theme={statusInfo?.color}
                darkBackground
                size="small"
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
              <ColoredSection color="var(--blue)">
                <h2 className={styles.gradientHeader}>Sponsors</h2>
                {billResult.sponsors.length <= 6 ? (
                  <div
                    className={styles.sponsorsWrapper}
                    style={{
                      flexDirection: "row",
                      flexWrap: "wrap",
                      justifyContent: "center",
                    }}
                  >
                    {billResult.sponsors.map((sponsor, index) => (
                      <React.Fragment key={sponsor.id}>
                        <Candidate
                          itemId={sponsor.id}
                          candidate={sponsor as PoliticianResult}
                        />
                        {(index + 1) % 3 === 0 && (
                          <div style={{ width: "100%" }}></div>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                ) : (
                  <ul style={{ listStyle: "none", padding: 0 }}>
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
              </ColoredSection>
            )}

            <div
              style={{ position: "absolute", bottom: "20%", width: "400px" }}
            >
              <div
                style={{ position: "absolute", bottom: "20%", width: "400px" }}
              >
                <Badge
                  iconLeft={
                    <FaCircle size={12} color={`var(--${statusInfo?.color})`} />
                  }
                  theme={statusInfo?.color}
                  darkBackground
                  size="small"
                >
                  {titleCase(
                    billResult?.status?.replaceAll("_", " ") as string
                  )}
                </Badge>
              </div>
            </div>
          </Series.Sequence>
        </Series>
      </AbsoluteFill>
    </>
  );
};
