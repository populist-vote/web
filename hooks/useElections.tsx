import { useEffect, useState, useMemo } from "react";
import { useElectionsQuery, ElectionResult } from "generated";

export function useElections(initialSelectedElectionId?: string) {
  const electionsQuery = useElectionsQuery();
  const { data, isSuccess } = electionsQuery;
  const [selectedElectionId, setSelectedElectionId] = useState<
    string | undefined
  >(initialSelectedElectionId);

  // Sort by most current election - copy array to preserve chronological order
  const elections = useMemo(
    () =>
      data
        ? [...(data?.electionsByUserState as ElectionResult[])].sort((a, b) => {
            const today = new Date();
            const distancea = Math.abs(
              today.getTime() - new Date(a.electionDate).getTime()
            );
            const distanceb = Math.abs(
              today.getTime() - new Date(b.electionDate).getTime()
            );
            return distancea - distanceb;
          })
        : undefined,
    [data]
  );

  useEffect(() => {
    if (isSuccess && elections && !initialSelectedElectionId)
      setSelectedElectionId(elections[0]?.id);
  }, [isSuccess, elections, initialSelectedElectionId]);

  const selectedElection = useMemo(
    () =>
      selectedElectionId
        ? data?.electionsByUserState.find((e) => e.id)
        : undefined,
    [selectedElectionId, data?.electionsByUserState]
  );

  return {
    selectedElectionId,
    setSelectedElectionId,
    elections: data?.electionsByUserState as Partial<ElectionResult>[],
    selectedElection,
    ...electionsQuery,
  };
}
