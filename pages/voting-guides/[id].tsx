import { Layout, LoaderFlag, SEO } from "components";
import { Election } from "components/Ballot/Election";
import { useVotingGuideByIdQuery } from "generated";
import { useAuth } from "hooks/useAuth";
import { useSavedGuideIds } from "hooks/useSavedGuideIds";
import { VotingGuideProvider } from "hooks/useVotingGuide";
import { useRouter } from "next/router";
import { useEffect } from "react";

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
