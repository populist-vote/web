import { BallotMeasureResult } from "generated";
import styles from "./BallotMeasureCard.module.scss";
import { Badge } from "components/Badge/Badge";
import { FaCheckCircle } from "react-icons/fa";
import { RiCloseCircleFill } from "react-icons/ri";

export function BallotMeasureCard({
  measure = {},
  year,
}: {
  measure: Partial<BallotMeasureResult>;
  year: number;
}) {
  const { yesVotes, noVotes, numPrecinctsReporting, totalPrecincts } = measure;

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
