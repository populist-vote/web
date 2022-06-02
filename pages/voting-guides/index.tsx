import { NextPage } from "next";
import Head from "next/head";
import { useVotingGuidesByUserIdQuery, VotingGuideResult } from "generated";
import { Layout, Avatar, FlagSection, Button, LoaderFlag } from "components";
import styles from "./VotingGuides.module.scss";
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
  const user = useAuth({ redirectTo: "/login?next=voting-guides" });

  // TODO: This query will change to one that includes other users voting guides.
  // Not yet implemented on the server.
  const { data, isLoading, error } = useVotingGuidesByUserIdQuery({
    userId: user?.id || "",
  });

  const votingGuides = data?.votingGuidesByUserId;

  const election = data?.votingGuidesByUserId[0]?.election;

  if (!user) return null;

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
            {votingGuides && votingGuides.length < 1 && (
              <small>No voting guides</small>
            )}
            {votingGuides?.map((guide) => (
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
