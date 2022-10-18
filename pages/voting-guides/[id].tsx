import { Button, Layout, LoaderFlag, SEO, VotingGuideNav } from "components";
import { Election } from "components/Ballot/Election";
import { useVotingGuideByIdQuery, VotingGuideByIdQuery } from "generated";
import { useAuth } from "hooks/useAuth";
import { useSavedGuideIds } from "hooks/useSavedGuideIds";
import { VotingGuideProvider } from "hooks/useVotingGuide";
import { GetServerSideProps } from "next";
import { NextParsedUrlQuery } from "next/dist/server/request-meta";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { dehydrate, QueryClient } from "react-query";
import styles from "styles/modules/page.module.scss";

export default function VotingGuidePage() {
  const user = useAuth({ redirect: false });
  const { id } = useRouter().query;
  const votingGuideId = id as string;
  const { data, error, isLoading } = useVotingGuideByIdQuery({
    id: votingGuideId,
  });

  const guide = data?.votingGuideById;
  const mobileNavTitle = "Voting Guides";

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
      <SEO
        title={`${
          guide?.user.firstName ?? guide?.user.username
        }'s Voting Guide`}
      />
      <Layout mobileNavTitle={mobileNavTitle} showNavLogoOnMobile>
        <VotingGuideProvider votingGuideId={votingGuideId}>
          <VotingGuideNav />
          <div data-testid="voting-guide-page">
            <Election
              electionId={guide?.election.id as string}
              votingGuideId={votingGuideId}
            />
            {isGuideOwner && (
              <div className={styles.center}>
                <Link href="/ballot" passHref>
                  <Button
                    variant="secondary"
                    size="small"
                    label="Add more candidates from my ballot"
                  />
                </Link>
              </div>
            )}
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

  const mobileNavTitle = "Voting Guides";

  return {
    notFound: !data,
    props: {
      dehydratedState: state,
      mobileNavTitle,
    },
  };
};
