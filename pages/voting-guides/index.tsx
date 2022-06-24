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
import useDeviceInfo from "hooks/useDeviceInfo";

const getGuideUrl = (guideId: string) =>
  `${window.location.origin}/ballot?votingGuideId=${guideId}`;

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

  const { isMobile } = useDeviceInfo();
  
  return (
    <div className={styles.guideContainer}>
      <div className={styles.avatarContainer}>
        <Avatar
          src={PERSON_FALLBACK_IMAGE_URL}
          size={ !isMobile ? 80 : 40 }
          fallbackSrc={PERSON_FALLBACK_IMAGE_URL}
          alt={name as string}
        />
        <span className={styles.avatarName}>{name}</span>
      </div>
      <div className={styles.buttonWrapper}>
        {showEdit ? (
          <Button
            size={ !isMobile ? "large" : "small" }
            variant="secondary"
            label="Edit"
            onClick={() => Router.push(`/ballot`)}
          />
        ) : (
          <Button
            size={ !isMobile ? "large" : "small" }
            variant="secondary"
            label="View"
            onClick={() => Router.push(`/ballot?votingGuideId=${guide.id}`)}
          />
        )}
        <Button
          size={ !isMobile ? "large" : "small" }
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
    <div className={styles.electionHeader}>
      {election.electionDate && <h1>{dateString(election.electionDate, true)}</h1>}
      {election.title && <h4>{election.title}</h4>}
      {election.description && <p>{election.description}</p>}
    </div>
  );
};

const VotingGuides: NextPage<{
  mobileNavTitle?: string;
}> = ({ mobileNavTitle }) => {
  const user = useAuth({ redirectTo: "/login?next=voting-guides" });

  const { data, isLoading, error } = useVotingGuidesByUserIdQuery(
    {
      userId: user?.id,
    },
    {
      enabled: !!user,
    }
  );
  const userVotingGuides = data?.votingGuidesByUserId;
  const election = data?.votingGuidesByUserId[0]?.election;
  const { savedGuideIds } = useSavedGuideIds(user?.id);
  const savedGuidesQuery = useVotingGuidesByIdsQuery({
    ids: savedGuideIds,
  });

  if (!user) return null;

  return (
    <>
      <Head>
        <title>Populist - Voting Guides</title>
        <meta name="description" content="View Voting Guides." />
      </Head>

      <Layout mobileNavTitle={`${mobileNavTitle || "Voting Guides"}`}>
        <div className={styles.votingContainer}>
          <FlagSection title="Voting Guides" hideFlagForMobile>
            {election && (
              <ElectionHeader election={election as ElectionResult} />
            )}
            {isLoading && <LoaderFlag />}
            {error && <small>Something went wrong...</small>}
            {userVotingGuides && userVotingGuides.length < 1 && (
              <>
                <small>No voting guides</small>
              </>
            )}
            <div className={styles.guidesContainer}>
            {userVotingGuides?.map((guide) => (
              <VotingGuideCard
                guide={guide as Partial<VotingGuideResult>}
                key={guide.id}
                showEdit={user.id === guide.user.id}
              />
            ))}
            </div>
          </FlagSection>
        </div>
        {!!savedGuidesQuery.data?.votingGuidesByIds?.length && (
          <div className={styles.votingContainer}>
            <FlagSection title="Other Guides">

              {savedGuidesQuery.isLoading && <LoaderFlag />}
              {savedGuidesQuery.error && <small>Something went wrong...</small>}

              <div className={styles.otherGuidesContainer}>
              {savedGuidesQuery.data?.votingGuidesByIds?.map((guide) => (
                <VotingGuideCard
                  guide={guide as Partial<VotingGuideResult>}
                  key={guide.id}
                  showEdit={user.id === guide.user.id}
                />
              ))}
              </div>
            </FlagSection>
          </div>
        )}
      </Layout>
    </>
  );
};

export default VotingGuides;
