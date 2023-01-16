import { useMemo } from "react";
import { NextPage } from "next";
import Router from "next/router";
import { toast } from "react-toastify";
import { IoIosRemoveCircle } from "react-icons/io";
import {
  useVotingGuidesByUserIdQuery,
  VotingGuideResult,
  useVotingGuidesByIdsQuery,
  ElectionResult,
} from "generated";
import {
  Layout,
  Avatar,
  FlagSection,
  Button,
  LoaderFlag,
  ElectionSelector,
} from "components";
import { ElectionHeader } from "components/Ballot/ElectionHeader";
import { useAuth } from "hooks/useAuth";
import { useSavedGuideIds } from "hooks/useSavedGuideIds";
import useDeviceInfo from "hooks/useDeviceInfo";
import { useElections } from "hooks/useElections";
import { PERSON_FALLBACK_IMAGE_URL } from "utils/constants";
import styles from "./VotingGuides.module.scss";
import { SupportedLocale } from "global";
import nextI18nextConfig from "next-i18next.config";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const VotingGuideCard = ({
  guide,
  showEdit = false,
  deleteAction,
}: {
  guide: Partial<VotingGuideResult>;
  showEdit?: boolean;
  deleteAction?: () => void;
}) => {
  const { user } = guide;
  const { firstName, lastName, username } = user || {};
  const name = firstName
    ? `${firstName} ${!!lastName ? lastName : ""}`
    : username;

  const { isMobile } = useDeviceInfo();

  const guideHref = `/voting-guides/${guide.id}`;

  const getGuideUrl = (guideId: string) =>
    `${window.location.origin}/voting-guides/${guideId}`;

  const copyGuideUrl = (guideId?: string) => {
    if (!guideId) return;
    const url = getGuideUrl(guideId);

    if (!!navigator.canShare && isMobile) {
      navigator
        .share({
          title: "Share your voting guide",
          text: "Check out this voting guide made on Populist!",
          url,
        })
        .then(() =>
          toast(
            `The link to your voting guide has been copied to the clipboard.`,
            {
              autoClose: 3000,
            }
          )
        )
        .catch((err) => console.error("Problem copying to clipboard", err));
    } else {
      navigator.clipboard
        .writeText(url)
        .then(() =>
          toast(
            `The link to your voting guide has been copied to the clipboard.`,
            {
              position: "bottom-center",
            }
          )
        )
        .catch((err) => console.error("Problem copying to clipboard", err));
    }
  };

  return (
    <div className={styles.guideContainer}>
      <div className={styles.avatarContainer}>
        <Avatar
          src={user?.profilePictureUrl || PERSON_FALLBACK_IMAGE_URL}
          size={!isMobile ? 80 : 40}
          fallbackSrc={PERSON_FALLBACK_IMAGE_URL}
          alt={name as string}
        />
        <span className={styles.avatarName}>{name}</span>
      </div>
      <div className={styles.buttonWrapper}>
        {showEdit ? (
          <Button
            size={!isMobile ? "large" : "small"}
            variant="secondary"
            label="Edit"
            onClick={() => Router.push(guideHref)}
          />
        ) : (
          <Button
            size={!isMobile ? "large" : "small"}
            variant="secondary"
            label="View"
            onClick={() => Router.push(guideHref)}
          />
        )}
        <Button
          size={!isMobile ? "large" : "small"}
          variant="primary"
          theme="yellow"
          label="Share"
          onClick={() => copyGuideUrl(guide?.id)}
        />
        {deleteAction && (
          <button
            className={styles.deleteButton}
            onClick={() => deleteAction()}
          >
            <IoIosRemoveCircle size="2rem" />
          </button>
        )}
      </div>
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

  const { savedGuideIds } = useSavedGuideIds(user?.id);
  const savedGuidesQuery = useVotingGuidesByIdsQuery({
    ids: savedGuideIds,
  });

  const {
    selectedElectionId,
    setSelectedElectionId,
    elections,
    isLoading: isElectionsLoading,
  } = useElections();

  const election = useMemo(
    () =>
      data?.votingGuidesByUserId.find(
        (g) => g.electionId === selectedElectionId
      )?.election as ElectionResult,
    [data, selectedElectionId]
  );

  const userVotingGuides = useMemo(
    () =>
      data?.votingGuidesByUserId.filter(
        (g) => g.electionId === selectedElectionId
      ),
    [data, selectedElectionId]
  );

  const savedGuides = useMemo(
    () =>
      savedGuidesQuery.data?.votingGuidesByIds.filter(
        (g) => g.electionId === selectedElectionId
      ) as VotingGuideResult[],
    [savedGuidesQuery.data, selectedElectionId]
  );

  if (!user) return null;

  const showLoader =
    isLoading || isElectionsLoading || savedGuidesQuery.isLoading;

  return (
    <Layout mobileNavTitle={`${mobileNavTitle || "Voting Guides"}`}>
      <div className={styles.votingContainer}>
        <ElectionSelector
          elections={elections}
          selectedElectionId={selectedElectionId as string}
          setSelectedElectionId={setSelectedElectionId}
        />
        {election && <ElectionHeader election={election} />}
        {showLoader && (
          <div className={styles.center}>
            <LoaderFlag />{" "}
          </div>
        )}
        {!showLoader && (
          <FlagSection label="My Voting Guides">
            <>
              {error && <small>Something went wrong...</small>}
              {userVotingGuides && (userVotingGuides?.length as number) < 1 && (
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
            </>
          </FlagSection>
        )}
      </div>

      {!!savedGuides?.length && !savedGuidesQuery.isLoading && (
        <div className={styles.votingContainer}>
          <FlagSection label="Other Guides">
            <>
              {savedGuidesQuery.error && <small>Something went wrong...</small>}

              <div className={styles.otherGuidesContainer}>
                {savedGuides.map((guide) => (
                  <VotingGuideCard
                    guide={guide as Partial<VotingGuideResult>}
                    key={guide.id}
                    showEdit={user.id === guide.user.id}
                  />
                ))}
              </div>
            </>
          </FlagSection>
        </div>
      )}
    </Layout>
  );
};

export default VotingGuides;

export async function getServerSideProps({
  locale,
}: {
  locale: SupportedLocale;
}) {
  return {
    props: {
      title: "Voting Guides",
      description:
        "Check out voting guides from organizations and fellow voters on Populist.",
      ...(await serverSideTranslations(
        locale,
        ["auth", "common"],
        nextI18nextConfig
      )),
    },
  };
}
