import { useEffect, useState } from "react";
import { useElectionsQuery, ElectionResult } from "generated";

export function useElections() {
  const electionsQuery = useElectionsQuery();
  const { data, isSuccess } = electionsQuery;
  const [selectedElectionId, setSelectedElectionId] = useState<
    string | undefined
  >();

  useEffect(() => {
    if (isSuccess)
      setSelectedElectionId(
        // Sort by most current election - copy array to preserve chronological order
        [...(data?.electionsByUserState as ElectionResult[])].sort((a, b) => {
          const today = new Date();
          const distancea = Math.abs(
            today.getTime() - new Date(a.electionDate).getTime()
          );
          const distanceb = Math.abs(
            today.getTime() - new Date(b.electionDate).getTime()
          );
          return distancea - distanceb;
        })[0]?.id
      );
  }, [isSuccess, data]);

  return {
    selectedElectionId,
    setSelectedElectionId,
    elections: data?.electionsByUserState as Partial<ElectionResult>[],
    ...electionsQuery,
  };
}
