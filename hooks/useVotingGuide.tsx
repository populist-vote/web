import {
  Exact,
  useCurrentUserQuery,
  useVotingGuideByIdQuery,
  VotingGuideResult,
} from "generated";
import { createContext, useContext } from "react";
import type { PropsWithChildren } from "react";

type VotingGuideQueryContext = {
  data: VotingGuideResult;
  isGuideOwner: boolean;
  queryKey: (string | Exact<{ id: string }>)[];
};

const VotingGuideContext = createContext<VotingGuideQueryContext>(
  {} as VotingGuideQueryContext
);

export function VotingGuideProvider({
  votingGuideId,
  children,
}: PropsWithChildren<{
  votingGuideId: string;
}>) {
  const { data: { currentUser } = {} } = useCurrentUserQuery();
  const { data } = useVotingGuideByIdQuery(
    { id: votingGuideId },
    {
      enabled: !!votingGuideId,
    }
  );

  const queryKey = useVotingGuideByIdQuery.getKey({ id: votingGuideId });
  const isGuideOwner = currentUser?.id === data?.votingGuideById.user.id;

  return (
    <VotingGuideContext.Provider
      value={{
        data: data?.votingGuideById as VotingGuideResult,
        isGuideOwner,
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
