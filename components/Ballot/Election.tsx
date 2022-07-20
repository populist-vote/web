import { LoaderFlag } from "components/LoaderFlag/LoaderFlag";
import {
  ElectionResult,
  RaceResult,
  useElectionByIdQuery,
  useElectionVotingGuideRacesQuery,
} from "generated";
import { useVotingGuide } from "hooks/useVotingGuide";
import { ElectionRaces } from "./BallotRaces";
import { ElectionHeader } from "./ElectionHeader";
import styles from "./Ballot.module.scss";

function Election({
  electionId,
  flagLabel,
}: {
  electionId: string;
  flagLabel: string;
}) {
  const { data: votingGuide, isGuideOwner } = useVotingGuide();
  const electionQuery = useElectionByIdQuery(
    {
      id: electionId,
    },
    {
      enabled: !votingGuide?.id || isGuideOwner,
    }
  );

  const electionVotingGuideRacesQuery = useElectionVotingGuideRacesQuery(
    {
      electionId,
      votingGuideId: votingGuide?.id,
    },
    {
      enabled: !isGuideOwner && !!votingGuide?.id,
    }
  );

  const isLoading =
    electionQuery.isLoading || electionVotingGuideRacesQuery.isLoading;
  const isError =
    electionQuery.isError || electionVotingGuideRacesQuery.isError;
  const error = electionQuery.error || electionVotingGuideRacesQuery.error;

  if (isLoading) return <LoaderFlag />;
  if (isError) return <div>{JSON.stringify(error)}</div>;

  const election =
    electionVotingGuideRacesQuery.data?.electionById ??
    electionQuery.data?.electionById;

  const races =
    electionVotingGuideRacesQuery.data?.electionById.racesByVotingGuide ??
    (electionQuery?.data?.electionById?.racesByUserDistricts || []);

  return (
    <>
      <ElectionHeader
        flagLabel={flagLabel}
        election={election as Partial<ElectionResult>}
      />
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
