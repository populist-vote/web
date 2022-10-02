import { ElectionResult } from "generated";
import ballotStyles from "./Ballot.module.scss";
import { dateString } from "utils/dates";

function ElectionHeader({
  election,
}: {
  election: Partial<ElectionResult>;
}) {
  return (
      <div className={ballotStyles.electionHeader}>
        {election.electionDate && (
          <h1>{dateString(election.electionDate, true)}</h1>
        )}
        {election.title && <h4>{election.title}</h4>}
        {election.description && <p>{election.description}</p>}
      </div>
  );
}

export { ElectionHeader };
