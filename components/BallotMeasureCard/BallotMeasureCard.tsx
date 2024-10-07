import { BallotMeasureResult } from "generated";
import styles from "./BallotMeasureCard.module.scss";
import { Badge } from "components/Badge/Badge";
import { FaCheckCircle } from "react-icons/fa";
import { RiCloseCircleFill } from "react-icons/ri";

type BallotMeasureCardProps =
  | {
      measure: Partial<BallotMeasureResult>;
      ballotMeasureId?: never;
      year: number;
    } // Case when measure is provided
  | { measure?: never; ballotMeasureId: string; year: number }; // Case when ballotMeasureId is provided

export function BallotMeasureCard({
  measure = {},
  ballotMeasureId,
  year,
}: BallotMeasureCardProps) {
  if (!measure && !ballotMeasureId) {
    throw new Error(
      "BallotMeasureCard must have either a measure or ballotMeasureId prop"
    );
  }

  // If ballotMeasureId is provided, fetch data using the query hook
  let data;
  if (ballotMeasureId) {
    ({ data } = useBallotMeasureByIdQuery({ id: ballotMeasureId }));
  }

  // If `measure` is provided, extract its properties
  const {
    yesVotes = data?.yesVotes,
    noVotes = data?.noVotes,
    numPrecinctsReporting = data?.numPrecinctsReporting,
    totalPrecincts = data?.totalPrecincts,
  } = measure || data || {};

  const totalVotes = (yesVotes ?? 0) + (noVotes ?? 0);
  const yesPercentage =
    totalVotes > 0
      ? (((yesVotes ?? 0) / totalVotes) * 100).toFixed(2) + "%"
      : "YES";
  const noPercentage =
    totalVotes > 0
      ? (((noVotes ?? 0) / totalVotes) * 100).toFixed(2) + "%"
      : "NO";
  const precinctReportingPercentage =
    (numPrecinctsReporting ?? 0) > 0
      ? (((numPrecinctsReporting ?? 0) / (totalPrecincts ?? 1)) * 100).toFixed(
          0
        ) + "%"
      : "0";

  const hasResults = totalVotes > 0 && (numPrecinctsReporting ?? 0) > 0;

  return (
    <div className={styles.billCard}>
      <header className={styles.header}>
        <strong>{`${measure.state} - ${measure.ballotMeasureCode}`}</strong>
        <strong>{year}</strong>
      </header>
      <div className={styles.cardContent}>
        <h2 className={styles.title}>{measure.title}</h2>
        <p className={styles.description}>{measure.description}</p>
        <div className={styles.voteInfo}>
          <div
            className={styles.votes}
            style={{ justifyContent: hasResults ? "flex-start" : "center" }}
          >
            <Badge
              iconLeft={
                <FaCheckCircle size={18} color="var(--green-support)" />
              }
            >
              {yesPercentage}
            </Badge>
            <Badge
              iconLeft={<RiCloseCircleFill size={18} color="var(--red)" />}
            >
              {noPercentage}
            </Badge>
          </div>
          {hasResults && (
            <Badge theme="green" lightBackground>
              {precinctReportingPercentage} precincts reporting
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}
