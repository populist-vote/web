import {
  Exact,
  useCurrentUserQuery,
  useVotingGuideByIdQuery,
  VotingGuideResult,
} from "../generated";
import { createContext, useContext } from "react";
import type { PropsWithChildren } from "react";

type VotingGuideQueryContext = {
  data: VotingGuideResult;
  isGuideOwner: boolean;
  guideAuthor: {
    name: string;
    profilePictureUrl?: string;
  };
  queryKey: (string | Exact<{ id: string }>)[];
  enabled: boolean;
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
  const { data: { currentUser = {} } = {} } = useCurrentUserQuery();
  const { data } = useVotingGuideByIdQuery(
    { id: votingGuideId },
    {
      enabled: !!votingGuideId,
    }
  );

  const guide = data?.votingGuideById;

  const votingGuideAuthorName = (
    guide?.user?.firstName && guide?.user?.lastName
      ? `${guide?.user?.firstName} ${guide?.user.lastName}`
      : guide?.user?.username
  ) as string;

  const queryKey = useVotingGuideByIdQuery.getKey({ id: votingGuideId });
  const isGuideOwner = currentUser?.id === guide?.user.id;
  const guideAuthor = {
    name: votingGuideAuthorName,
    profilePictureUrl: guide?.user?.profilePictureUrl as string,
  };

  return (
    <VotingGuideContext.Provider
      value={{
        data: guide as VotingGuideResult,
        guideAuthor,
        isGuideOwner,
        queryKey,
        enabled: !!votingGuideId,
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
