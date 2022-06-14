import { NextPage } from "next";
import Head from "next/head";
import {
  useVotingGuidesByUserIdQuery,
  VotingGuideResult,
  useVotingGuidesByIdsQuery,
} from "generated";
import { Layout, Avatar, FlagSection, Button, LoaderFlag } from "components";
import styles from "./VotingGuides.module.scss";
import { useAuth } from "hooks/useAuth";
import { dateString } from "utils/dates";
import { PERSON_FALLBACK_IMAGE_URL } from "utils/constants";
import { useSavedGuideIds } from "hooks/useSavedGuideIds";

const VotingGuideCard = ({
  guide,
  showEdit = false,
}: {
  guide: Partial<VotingGuideResult>;
  showEdit?: boolean;
}) => {
  const { user } = guide;
  const { firstName, lastName, username } = user || {};
  const name = firstName
    ? `${firstName} ${!!lastName ? lastName : ""}`
    : username;
  return (
    <div className={styles.guideContainer}>
      <div className={styles.avatarContainer}>
        <Avatar
          src={PERSON_FALLBACK_IMAGE_URL}
          size={80}
          fallbackSrc={PERSON_FALLBACK_IMAGE_URL}
          alt={name as string}
        />
        <h4>{name}</h4>
      </div>
      <div className={styles.buttonWrapper}>
        {showEdit && <Button size="large" variant="secondary" label="Edit" />}
        <Button size="large" variant="primary" theme="yellow" label="Share" />
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
  const { data, isLoading, error } = useVotingGuidesByUserIdQuery(
    {
      userId: user?.id,
    },
    {
      enabled: !!user,
    }
  );

  const votingGuides = data?.votingGuidesByUserId;

  const election = data?.votingGuidesByUserId[0]?.election;

  const { savedGuideIds } = useSavedGuideIds();

  const savedGuides = useVotingGuidesByIdsQuery({ ids: savedGuideIds });

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
          <FlagSection title="My Voting Guide">
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
                showEdit={user.id === guide.user.id}
              />
            ))}
          </FlagSection>
        </div>
        {!!savedGuides?.data?.votingGuidesByIds?.length && (
          <div className={styles.votingContainer}>
            <FlagSection title="Other Guides">
              {/* This section uses {election} since we only have one right now.
                As the app gets more dynamic this must be changed. */}
              <div className={styles.votingHeader}>
                <h1>{dateString(election?.electionDate)}</h1>
                <h2>{election?.title}</h2>
                <p>{election?.description}</p>
              </div>

              {savedGuides.isLoading && <LoaderFlag />}
              {savedGuides.error && <small>Something went wrong...</small>}

              {savedGuides.data?.votingGuidesByIds?.map((guide) => (
                <VotingGuideCard
                  guide={guide as Partial<VotingGuideResult>}
                  key={guide.id}
                  showEdit={user.id === guide.user.id}
                />
              ))}
            </FlagSection>
          </div>
        )}
      </Layout>
    </>
  );
};

export default VotingGuides;
