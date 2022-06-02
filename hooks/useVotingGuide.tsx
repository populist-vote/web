import {
  Exact,
  useElectionVotingGuideByUserIdQuery,
  useUpsertVotingGuideMutation,
  VotingGuideResult,
} from "generated";
import { createContext, ReactNode, useContext } from "react";
import { useQueryClient } from "react-query";

type VotingGuideQueryContext = {
  data: VotingGuideResult;
  queryKey: (string | Exact<{ electionId: string; userId: string }>)[];
};

const VotingGuideContext = createContext<VotingGuideQueryContext>(
  {} as VotingGuideQueryContext
);

export function VotingGuideProvider({
  electionId,
  userId,
  children,
}: {
  electionId: string;
  userId: string;
  children: ReactNode;
}) {
  const { data, isLoading, error } = useElectionVotingGuideByUserIdQuery({
    electionId,
    userId,
  });

  const queryKey = useElectionVotingGuideByUserIdQuery.getKey({
    electionId,
    userId,
  });

  const queryClient = useQueryClient();

  const createVotingGuide = useUpsertVotingGuideMutation({
    onSuccess: () => queryClient.invalidateQueries(queryKey),
  });

  if (!data?.electionVotingGuideByUserId)
    createVotingGuide.mutate({ electionId: electionId as string });

  if (isLoading || error) return null;

  return (
    <VotingGuideContext.Provider
      value={{
        data: data?.electionVotingGuideByUserId as VotingGuideResult,
        queryKey,
      }}
    >
      {children}
    </VotingGuideContext.Provider>
  );
}

export function useVotingGuide() {
  const votingGuide = useContext(VotingGuideContext);
  return votingGuide;
}
