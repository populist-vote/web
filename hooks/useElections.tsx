import { useEffect, useState, useMemo } from "react";
import { useElectionsQuery, ElectionResult } from "generated";

export function useElections() {
  const electionsQuery = useElectionsQuery();
  const { data, isSuccess } = electionsQuery;
  const [selectedElectionId, setSelectedElectionId] = useState<
    string | undefined
  >();

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
    if (isSuccess && elections) setSelectedElectionId(elections[0]?.id);
  }, [isSuccess, elections]);

  return {
    selectedElectionId,
    setSelectedElectionId,
    elections: data?.electionsByUserState as Partial<ElectionResult>[],
    ...electionsQuery,
  };
}
