import { ElectionResult } from "generated";
import { LeftArrowIcon, RightArrowIcon } from "components/Icons";
import { dateString } from "utils/dates";
import styles from "./ElectionSelector.module.scss";
import { useMediaQuery } from "hooks/useMediaQuery";

function ElectionSelector({
  elections,
  selectedElectionId,
  setSelectedElectionId,
}: {
  elections: Partial<ElectionResult>[];
  selectedElectionId: string;
  setSelectedElectionId: (electionId: string) => void;
}) {
  const currentElectionIndex = elections.findIndex(
    (e) => e.id === selectedElectionId
  );
  const hasPreviousElection =
    typeof elections[currentElectionIndex - 1] !== "undefined";
  const previousElection = elections[currentElectionIndex - 1];

  const hasNextElection =
    typeof elections[currentElectionIndex + 1] !== "undefined";
  const nextElection = elections[currentElectionIndex + 1];
  const isSmallScreen = useMediaQuery("(max-width: 896px)");

  if (elections.length <= 1) return null;

  return (
    <div className={styles.container}>
      <button
        disabled={!hasPreviousElection}
        onClick={() => setSelectedElectionId(previousElection?.id as string)}
      >
        <LeftArrowIcon />
        {isSmallScreen ? (
          <div className={styles.lastLabel}>
            <h4>Last Vote</h4>
          </div>
        ) : (
          hasPreviousElection &&
          !hasNextElection && (
            <div className={styles.lastLabel}>
              <h4>Last Vote</h4>
              <h3>{dateString(previousElection?.electionDate, true)}</h3>
            </div>
          )
        )}
      </button>
      <button
        disabled={!hasNextElection}
        onClick={() => setSelectedElectionId(nextElection?.id as string)}
      >
        {isSmallScreen ? (
          <div className={styles.nextLabel}>
            <h4>Next Vote</h4>
          </div>
        ) : (
          hasNextElection && (
            <div className={styles.nextLabel}>
              <h4>Next Vote</h4>
              <h3>{dateString(nextElection?.electionDate, true)}</h3>
            </div>
          )
        )}

        <RightArrowIcon />
      </button>
    </div>
  );
}

export { ElectionSelector };
