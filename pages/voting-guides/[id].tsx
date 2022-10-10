import { Layout, LoaderFlag, SEO } from "components";
import { Election } from "components/Ballot/Election";
import { useVotingGuideByIdQuery, VotingGuideByIdQuery } from "generated";
import { useAuth } from "hooks/useAuth";
import { useSavedGuideIds } from "hooks/useSavedGuideIds";
import { VotingGuideProvider } from "hooks/useVotingGuide";
import { GetServerSideProps } from "next";
import { NextParsedUrlQuery } from "next/dist/server/request-meta";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { dehydrate, QueryClient } from "react-query";

export default function VotingGuidePage() {
  const user = useAuth({ redirect: false });
  const { id } = useRouter().query;
  const votingGuideId = id as string;
  const { data, error, isLoading } = useVotingGuideByIdQuery({
    id: votingGuideId,
  });

  const guide = data?.votingGuideById;
  const mobileNavTitle = `${
    guide?.user?.firstName || guide?.user?.username
  }'s Voting Guide`;

  const userGuideId = guide?.user.id;
  const isGuideOwner = user?.id === userGuideId;

  const { addSavedGuideId } = useSavedGuideIds(user?.id);

  // Add this voting guide to users saved guides in local storage if they are not the owner
  useEffect(() => {
    if (!!userGuideId && !isGuideOwner) {
      addSavedGuideId(votingGuideId);
    }
  }, [votingGuideId, userGuideId, isGuideOwner, addSavedGuideId]);

  if (isLoading) return <LoaderFlag />;
  if (error) return <div>{JSON.stringify(error)}</div>;

  return (
    <>
      <SEO title="Voting Guide" />
      <Layout mobileNavTitle={mobileNavTitle} showNavLogoOnMobile>
        <VotingGuideProvider votingGuideId={votingGuideId}>
          <div data-testid="voting-guide-page">
            <Election
              electionId={guide?.election.id as string}
              flagLabel={mobileNavTitle}
              votingGuideId={votingGuideId}
            />
          </div>
        </VotingGuideProvider>
      </Layout>
    </>
  );
}

interface Params extends NextParsedUrlQuery {
  id: string;
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { id } = ctx.query as Params;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(
    useVotingGuideByIdQuery.getKey({ id }),
    useVotingGuideByIdQuery.fetcher({ id })
  );

  const state = dehydrate(queryClient);

  const data = state.queries[0]?.state.data as VotingGuideByIdQuery;
  const guide = data?.votingGuideById;
  const mobileNavTitle = `${
    guide?.user?.firstName || guide?.user?.username
  }'s Voting Guide`;

  return {
    notFound: !data,
    props: {
      dehydratedState: state,
      mobileNavTitle,
    },
  };
};
