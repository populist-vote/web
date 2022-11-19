import { LoaderFlag } from "components/LoaderFlag/LoaderFlag";
import {
  ElectionResult,
  RaceResult,
  State,
  useElectionByIdQuery,
  useElectionVotingGuideRacesQuery,
} from "generated";
import { ElectionRaces } from "./BallotRaces";
import { ElectionHeader } from "./ElectionHeader";
import styles from "./Ballot.module.scss";
import { useAuth } from "hooks/useAuth";
import { Button } from "components/Button/Button";

function Election({
  electionId,
  votingGuideId,
}: {
  electionId: string;
  votingGuideId?: string;
  votingGuideAuthor?: {
    name: string;
    profilePictureUrl: string;
  };
}) {
  const electionQuery = useElectionByIdQuery(
    {
      id: electionId,
    },
    {
      enabled: !votingGuideId,
    }
  );

  const electionVotingGuideRacesQuery = useElectionVotingGuideRacesQuery(
    {
      electionId,
      votingGuideId: votingGuideId as string,
    },
    {
      enabled: !!votingGuideId,
    }
  );

  const user = useAuth({ redirect: false });
  const isColoradan = user?.userProfile?.address?.state == State.Co;

  const isLoading =
    (electionQuery.isLoading && electionQuery.fetchStatus != "idle") ||
    // https://github.com/TanStack/query/issues/3975
    (electionVotingGuideRacesQuery.fetchStatus != "idle" &&
      electionVotingGuideRacesQuery.isLoading);
  const isError =
    electionQuery.isError || electionVotingGuideRacesQuery.isError;
  const error = electionQuery.error || electionVotingGuideRacesQuery.error;

  if (isLoading)
    return (
      <div className={styles.center}>
        <LoaderFlag />
      </div>
    );
  if (isError) return <div>Error: {JSON.stringify(error)}</div>;

  const election =
    electionVotingGuideRacesQuery.data?.electionById ??
    electionQuery.data?.electionById;

  const races =
    electionVotingGuideRacesQuery.data?.electionById.racesByVotingGuide ??
    (electionQuery?.data?.electionById?.racesByUserDistricts || []);

  return (
    <>
      <ElectionHeader election={election as Partial<ElectionResult>} />
      {isColoradan && (
        <a href="https://measures.populist.us/colorado">
          <div className={styles.ballotMeasuresButton}>
            <Button
              variant="primary"
              size="large"
              label="Colorado Ballot Measures"
            />
          </div>
        </a>
      )}
      {electionVotingGuideRacesQuery.isSuccess && races.length < 1 && (
        <div className={styles.electionHeader}>
          <small>
            This voting guide doesn't have any candidates selected for this
            election
          </small>
        </div>
      )}
      <ElectionRaces races={races as RaceResult[]} />
    </>
  );
}

export { Election };
