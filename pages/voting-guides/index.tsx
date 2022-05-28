import { useState } from "react";
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

const VotingGuideCard = ({ guide }: { guide: Partial<VotingGuideResult> }) => {
  const { user } = guide;
  const { firstName, lastName, avatarUrl, username } = user || {};
  const name = firstName
    ? `${firstName} ${!!lastName ? lastName : ""}`
    : username;
  return (
    <div className={`${styles.roundedCard} ${styles.votingCardContainer}`}>
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
          <Button large primary theme="blue" label="Edit">
            Edit
          </Button>
          <span className={styles.shareButton}>
            <Button large primary theme="yellow" label="Share">
              Share
            </Button>
          </span>
        </div>
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

  const upsertVotingGuide = useUpsertVotingGuideMutation({
    onSuccess: () => invalidateVotingGuideQuery(),
  });

  const election = data?.votingGuidesByUserId[0]?.election;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

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
            <div>
              <h1>{election?.title}</h1>
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

        <div className={styles.roundedCard}>
          <h2>Add a test guide </h2>
          <h3>(for CO Primary Election)</h3>
          <input
            className={styles.guideInput}
            type="text"
            placeholder="Title"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
          />
          <input
            className={styles.guideInput}
            type="text"
            placeholder="Description"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
          />
          <Button
            large
            theme="blue"
            disabled={!title || !description}
            label="add_guide"
            onClick={() =>
              upsertVotingGuide.mutate(
                {
                  electionId: "652b6615-e822-4cc1-9959-6d4c15d0acea",
                  title,
                  description,
                },
                {
                  onError: (err) => {
                    alert("Your guide was not added");
                    console.error("guide not added", err);
                  },
                }
              )
            }
          >
            Add Test Guide
          </Button>
        </div>
      </Layout>
    </>
  );
};

export default VotingGuides;
