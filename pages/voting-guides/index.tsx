import { NextPage } from "next";
import Head from "next/head";
import {
  useUpsertVotingGuideMutation,
  useVotingGuidesByUserIdQuery,
  VotingGuideResult,
} from "generated";
import { Layout, Avatar, FlagSection, Button, LoaderFlag } from "components";
import styles from "./VotingGuides.module.scss";
import { useQueryClient } from "react-query";
import { useAuth } from "hooks/useAuth";
import { dateString } from "utils/dates";

const VotingGuideCard = ({ guide }: { guide: Partial<VotingGuideResult> }) => {
  const { user } = guide;
  const { firstName, lastName, avatarUrl, username } = user || {};
  const name = firstName
    ? `${firstName} ${!!lastName ? lastName : ""}`
    : username;
  return (
    <div className={styles.guideContainer}>
      <div className={styles.avatarContainer}>
        <Avatar
          src={avatarUrl || ""}
          size={80}
          fallbackSrc="https://www.gravatar.com/avatar/"
          alt={name as string}
        />
        <h4>{name}</h4>
      </div>
      <div className={styles.buttonWrapper}>
        <Button large primary theme="yellow" label="Share">
          Share
        </Button>
      </div>
    </div>
  );
};

const VotingGuides: NextPage<{
  mobileNavTitle?: string;
}> = ({ mobileNavTitle }) => {
  const queryClient = useQueryClient();

  const user = useAuth({ redirectTo: "/login?next=voting-guides" });

  const { data, isLoading, error } = useVotingGuidesByUserIdQuery({
    userId: user?.id || "",
  });

  const invalidateVotingGuideQuery = () =>
    queryClient.invalidateQueries(
      useVotingGuidesByUserIdQuery.getKey({ userId: user?.id as string })
    );

  const _upsertVotingGuide = useUpsertVotingGuideMutation({
    onSuccess: () => invalidateVotingGuideQuery(),
  });

  const election = data?.votingGuidesByUserId[0]?.election;

  return (
    <>
      <Head>
        <title>Populist - Voting Guides</title>
        <meta name="description" content="View Voting Guides." />
      </Head>

      <Layout
        mobileNavTitle={`${mobileNavTitle || "Voting Guides"}`}
        showNavLogoOnMobile={false}
      >
        <div className={styles.votingContainer}>
          <FlagSection title="Voting Guides">
            <div className={styles.votingHeader}>
              <h1>{dateString(election?.electionDate)}</h1>
              <h2>{election?.title}</h2>
              <p>{election?.description}</p>
            </div>
            {isLoading && <LoaderFlag />}
            {error && <small>Something went wrong...</small>}
            {data?.votingGuidesByUserId.map((guide) => (
              <VotingGuideCard
                guide={guide as Partial<VotingGuideResult>}
                key={guide.id}
              />
            ))}
          </FlagSection>
        </div>
      </Layout>
    </>
  );
};

export default VotingGuides;
