import { ElectionResult, State } from "generated";
import styles from "./Ballot.module.scss";
import { dateString } from "utils/dates";
import { Button } from "components/Button/Button";
import { useAuth } from "hooks/useAuth";

function ElectionHeader({ election }: { election: Partial<ElectionResult> }) {
  const user = useAuth();
  const isColoradan = user?.userProfile?.address?.state == State.Co;

  return (
    <div className={styles.electionHeader}>
      {election.electionDate && (
        <h1>{dateString(election.electionDate, true)}</h1>
      )}
      {election.title && <h4>{election.title}</h4>}
      {election.description && <p>{election.description}</p>}
      {isColoradan && (
        <a href="https://measures.populist.us/colorado">
          <Button
            variant="primary"
            size="large"
            label="Colorado Statewide Ballot Measures"
          />
        </a>
      )}
    </div>
  );
}

export { ElectionHeader };
