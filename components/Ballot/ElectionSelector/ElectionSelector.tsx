import { ElectionResult } from "generated";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { dateString } from "utils/dates";
import styles from "./ElectionSelector.module.scss";

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
  return (
    <div className={styles.container}>
      <button
        disabled={!hasPreviousElection}
        onClick={() => setSelectedElectionId(previousElection?.id as string)}
      >
        {hasPreviousElection && (
          <>
            <span>Previous Vote</span>
            <span>{dateString(previousElection?.electionDate)}</span>
          </>
        )}

        <FaChevronLeft />
      </button>
      <button
        disabled={!hasNextElection}
        onClick={() => setSelectedElectionId(nextElection?.id as string)}
      >
        {hasNextElection && (
          <>
            <span>Next Vote</span>
            <span>{dateString(nextElection?.electionDate)}</span>
          </>
        )}

        <FaChevronRight />
      </button>
    </div>
  );
}

export { ElectionSelector };
