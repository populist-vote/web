import { LoaderFlag } from "components/LoaderFlag/LoaderFlag";
import {
  ElectionResult,
  RaceResult,
  useElectionByIdQuery,
  useElectionVotingGuideRacesQuery,
} from "generated";
import { ElectionRaces } from "./BallotRaces";
import { ElectionHeader } from "./ElectionHeader";
import styles from "./Ballot.module.scss";
import { FlagSection } from "components/FlagSection/FlagSection";

function Election({
  electionId,
  flagLabel,
  votingGuideId,
}: {
  electionId: string;
  flagLabel?: string;
  votingGuideId?: string;
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

  const isLoading =
    electionQuery.isLoading || electionVotingGuideRacesQuery.isLoading;
  const isError =
    electionQuery.isError || electionVotingGuideRacesQuery.isError;
  const error = electionQuery.error || electionVotingGuideRacesQuery.error;

  if (isLoading) return <LoaderFlag />;
  if (isError) return <div>Error: {JSON.stringify(error)}</div>;

  const election =
    electionVotingGuideRacesQuery.data?.electionById ??
    electionQuery.data?.electionById;

  const races =
    electionVotingGuideRacesQuery.data?.electionById.racesByVotingGuide ??
    (electionQuery?.data?.electionById?.racesByUserDistricts || []);

  return (
    <>
      {flagLabel ? (
        <FlagSection title={flagLabel} hideFlagForMobile>
          <ElectionHeader election={election as Partial<ElectionResult>} />
        </FlagSection>
      ) : (
        <ElectionHeader election={election as Partial<ElectionResult>} />
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
