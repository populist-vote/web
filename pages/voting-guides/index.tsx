import { NextPage } from "next";
import Head from "next/head";
import Router from "next/router";
import {
  useVotingGuidesByUserIdQuery,
  VotingGuideResult,
  useVotingGuidesByIdsQuery,
  ElectionResult,
} from "generated";
import { Layout, Avatar, FlagSection, Button, LoaderFlag } from "components";
import styles from "./VotingGuides.module.scss";
import { useAuth } from "hooks/useAuth";
import { dateString } from "utils/dates";
import { PERSON_FALLBACK_IMAGE_URL } from "utils/constants";
import { useSavedGuideIds } from "hooks/useSavedGuideIds";

const getGuideUrl = (guideId: string) =>
  `${window.location.origin}/ballot?voting-guide-id=${guideId}`;

const copyGuideUrl = (guideId?: string) => {
  if (!guideId) return;

  const url = getGuideUrl(guideId);
  navigator.clipboard
    .writeText(url)
    .then(() => alert(`Link copied to clipboard: ${url}`))
    .catch((err) => console.error("Problem copying to clipboard", err));
};

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
        {showEdit ? (
          <Button
            size="large"
            variant="secondary"
            label="Edit"
            onClick={() => Router.push(`/ballot`)}
          />
        ) : (
          <Button
            size="large"
            variant="secondary"
            label="View"
            onClick={() => Router.push(`/ballot?voting-guide-id=${guide.id}`)}
          />
        )}
        <Button
          size="large"
          variant="primary"
          theme="yellow"
          label="Share"
          onClick={() => copyGuideUrl(guide?.id)}
        />
      </div>
    </div>
  );
};

const ElectionHeader = ({ election }: { election: ElectionResult }) => {
  return (
    <div className={styles.votingHeader}>
      {election.electionDate && <h1>{dateString(election.electionDate)}</h1>}
      {election.title && <h2>{election.title}</h2>}
      {election.description && <p>{election.description}</p>}
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

  const { savedGuideIds } = useSavedGuideIds(user.id);

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
            {election && (
              <ElectionHeader election={election as ElectionResult} />
            )}
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
        {!!savedGuides.data?.votingGuidesByIds?.length && (
          <div className={styles.votingContainer}>
            <FlagSection title="Other Guides">
              {/* This section uses {election} since we only have one right now.
                As the app gets more dynamic this must be changed. */}
              {election && (
                <ElectionHeader election={election as ElectionResult} />
              )}

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
