import { useState } from "react";
import { NextPage } from "next";
import Router from "next/router";
import nextI18nextConfig from "next-i18next.config";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { toast } from "react-toastify";

import {
  Layout,
  FlagSection,
  Button,
  LoaderFlag,
  TopNavElections,
  Box,
  Divider,
  RadioGroup,
} from "components";

import { useAuth } from "hooks/useAuth";
import { useSavedGuideIds } from "hooks/useSavedGuideIds";
import { useElections } from "hooks/useElections";
import { SELECTED_ELECTION } from "utils/constants";
import styles from "./VotingGuides.module.scss";
import { SupportedLocale } from "types/global";
import {
  useVotingGuidesByUserIdQuery,
  VotingGuideResult,
  useVotingGuidesByIdsQuery,
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
  // const { user } = guide;
  // const { firstName, lastName, username } = user || {};
  // const name = firstName
  //   ? `${firstName} ${!!lastName ? lastName : ""}`
  //   : username;

  const guideHref = `/voting-guides/${guide.id}`;

  const getGuideUrl = (guideId: string) =>
    `${window.location.origin}/voting-guides/${guideId}`;

  const copyGuideUrl = (guideId?: string) => {
    if (!guideId) return;
    const url = getGuideUrl(guideId);

    if (!!navigator.canShare) {
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
    <Box>
      <div className={styles.flexBetween}>
        <h4>{guide.election?.title}</h4>
        <h5>
          {new Date(guide.election?.electionDate).toLocaleDateString("en", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </h5>
      </div>
      <Divider style={{ margin: "1rem 0" }} />
      <div className={styles.flexBetween}>
        <Button
          size={"medium"}
          variant="primary"
          theme="yellow"
          label="Share"
          onClick={() => copyGuideUrl(guide?.id)}
        />
        <div className={styles.flexRight}>
          {showEdit ? (
            <Button
              size={"medium"}
              variant="secondary"
              label="Edit"
              onClick={() => Router.push(guideHref)}
            />
          ) : (
            <Button
              size={"medium"}
              variant="secondary"
              label="View"
              onClick={() => Router.push(guideHref)}
            />
          )}
          {deleteAction && (
            <Button
              variant="secondary"
              size="medium"
              onClick={deleteAction}
              label="Delete"
            />
          )}
        </div>
      </div>
    </Box>
  );
};

const VotingGuides: NextPage<{
  mobileNavTitle?: string;
}> = ({ mobileNavTitle }) => {
  const [selectedPage, setSelectedPage] = useState<
    "My Guides" | "Other Guides"
  >("My Guides");

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

  const userVotingGuides = data?.votingGuidesByUserId || [];

  const savedGuides = savedGuidesQuery.data?.votingGuidesByIds;

  const handleDelete = (guideId: string) => {
    if (!guideId) return;

    if (confirm("Are you sure you want to delete this guide?")) {
      // deleteAction();
    }
  };

  if (!user) return null;

  return (
    <Layout mobileNavTitle={`${mobileNavTitle || "Voting Guides"}`}>
      <TopNavElections selected="VotingGuide" electionData={electionData} />
      <div style={{ marginTop: "3rem" }}>
        <RadioGroup
          options={["My Guides", "Other Guides"]}
          selected={selectedPage}
          onChange={(value) =>
            setSelectedPage(value as "My Guides" | "Other Guides")
          }
        />
      </div>
      {selectedPage === "My Guides" && (
        <section>
          <h1 style={{ marginBottom: 0 }}>My Guides</h1>
          <p>
            Save and share who your voting for and why. Create your guide on
            your My Ballot page, or by browsing elections.
          </p>
          {isLoading && <LoaderFlag />}
          {userVotingGuides?.length > 0 && (
            <div className={styles.guidesContainer}>
              {userVotingGuides?.map((guide) => (
                <VotingGuideCard
                  guide={guide as Partial<VotingGuideResult>}
                  key={guide.id}
                  showEdit={user.id === guide.user.id}
                  deleteAction={() => handleDelete(guide.id)}
                />
              ))}
            </div>
          )}
        </section>
      )}
      {selectedPage === "Other Guides" && (
        <section>
          <h1>Other Guides</h1>
          <p>
            View voting guides from other Populist users and organizations.
            After clicking on any links to guides, they will be available here
            for you to revisit.
          </p>
          {!!savedGuides?.length && !savedGuidesQuery.isLoading && (
            <div className={styles.votingContainer}>
              <FlagSection label="Other Guides">
                <>
                  {savedGuidesQuery.error && (
                    <small>Something went wrong...</small>
                  )}

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
        </section>
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
