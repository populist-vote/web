import { LoaderFlag } from "components/LoaderFlag/LoaderFlag";
import { ElectionResult, RaceResult, useElectionByIdQuery } from "generated";
import { ElectionRaces } from "./BallotRaces";
import { ElectionHeader } from "./ElectionHeader";

function Election({
  electionId,
  flagLabel,
}: {
  electionId: string;
  flagLabel: string;
}) {
  const { data, isLoading, isError, error } = useElectionByIdQuery({
    id: electionId,
  });

  const races = data?.electionById?.racesByUserDistricts || [];

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
