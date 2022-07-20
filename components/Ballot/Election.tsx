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

function Election({
  electionId,
  flagLabel,
}: {
  electionId: string;
  flagLabel: string;
}) {
  const { data: votingGuide, isGuideOwner } = useVotingGuide();
  const { data, isLoading, isError, error } = useElectionByIdQuery(
    {
      id: electionId,
    },
    {
      enabled: !votingGuide.id || isGuideOwner,
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

  const races =
    electionVotingGuideRacesQuery.data?.electionById.racesByVotingGuide ??
    (data?.electionById?.racesByUserDistricts || []);

  if (isLoading) return <LoaderFlag />;
  if (isError) return <div>{JSON.stringify(error)}</div>;

  return (
    <>
      <ElectionHeader
        flagLabel={flagLabel}
        election={data?.electionById as Partial<ElectionResult>}
      />
      <ElectionRaces races={races as RaceResult[]} />
    </>
  );
}

export { Election };
