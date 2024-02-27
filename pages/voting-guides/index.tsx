import { useMemo } from "react";
import { NextPage } from "next";
import Router from "next/router";
import nextI18nextConfig from "next-i18next.config";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { toast } from "react-toastify";
import { IoIosRemoveCircle } from "react-icons/io";

import {
  Layout,
  Avatar,
  FlagSection,
  Button,
  LoaderFlag,
  TopNavElections,
} from "components";

import { ElectionHeader } from "components/Ballot/ElectionHeader";

import { useAuth } from "hooks/useAuth";
import { useSavedGuideIds } from "hooks/useSavedGuideIds";
import useDeviceInfo from "hooks/useDeviceInfo";
import { useElections } from "hooks/useElections";

import { PERSON_FALLBACK_IMAGE_URL, SELECTED_ELECTION } from "utils/constants";

import styles from "./VotingGuides.module.scss";
import { SupportedLocale } from "types/global";

import {
  useVotingGuidesByUserIdQuery,
  VotingGuideResult,
  useVotingGuidesByIdsQuery,
  ElectionResult,
  useElectionByIdQuery,
} from "generated";

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
        .catch((err) => toast.error("Problem copying to clipboard", err));
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
        .catch((err) => toast.error("Problem copying to clipboard", err));
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
  const { user } = useAuth({ redirectTo: "/login?next=voting-guides" });

  const { data, isLoading } = useVotingGuidesByUserIdQuery(
    {
      userId: user?.id,
    },
    {
      enabled: !!user,
    }
  );

  const { savedGuideIds } = useSavedGuideIds(user?.id);
  const savedGuidesQuery = useVotingGuidesByIdsQuery(
    {
      ids: savedGuideIds,
    },
    {
      enabled: savedGuideIds.length > 0,
      refetchOnMount: false,
    }
  );
  const electionData = useElections(
    sessionStorage.getItem(SELECTED_ELECTION) || undefined
  );
  const { selectedElectionId, isLoading: isElectionsLoading } = electionData;

  const electionByIdQuery = useElectionByIdQuery({
    id: selectedElectionId,
  });

  const electionById = electionByIdQuery?.data?.electionById as ElectionResult;

  const userVotingGuides = useMemo(
    () =>
      data?.votingGuidesByUserId.filter(
        (g) => g.electionId === selectedElectionId
      ) || [],
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
    isLoading ||
    isElectionsLoading ||
    electionByIdQuery.isLoading ||
    (savedGuidesQuery.isLoading && savedGuidesQuery.fetchStatus !== "idle");

  return (
    <Layout mobileNavTitle={`${mobileNavTitle || "Voting Guides"}`}>
      <TopNavElections
        selected="VotingGuide"
        showElectionSelector
        electionData={electionData}
      />
      <div className={styles.votingContainer}>
        {electionById && <ElectionHeader election={electionById} />}
        {showLoader && (
          <div className={styles.center}>
            <LoaderFlag />
          </div>
        )}
        {!showLoader && userVotingGuides.length > 0 && (
          <FlagSection label="My Voting Guides">
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
