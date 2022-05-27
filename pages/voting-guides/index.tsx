import { useState, useEffect } from "react";
import { NextPage } from "next";
import Head from "next/head";
import {
  Scalars,
  useUpsertVotingGuideMutation,
  useVotingGuidesByUserIdQuery,
  VotingGuideResult,
} from "generated";
import { Layout, Avatar, FlagSection, Button } from "components";
import { useAuth } from "hooks/useAuth";
import styles from "./VotingGuides.module.scss";

const VotingGuideCard = ({ guide }: { guide: VotingGuideResult }) => {
  const { user } = guide;
  const { firstName, lastName, avatarUrl, username } = user;
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
            alt={name}
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

interface VotingGuideElection {
  date: string;
  description?: string;
  guides: VotingGuideResult[];
  id: Scalars["ID"];
  title: string;
}

const getElectionsFromGuides = (
  guides: VotingGuideResult[]
): VotingGuideElection[] => {
  if (guides) {
    return guides.reduce<VotingGuideElection[]>((result, value) => {
      const i = result.findIndex((v) => v.id === value.electionId);
      if (i < 0) {
        const electionInfo = {
          id: value.electionId,
          title: value.election.title,
          description: value.election.description,
          date: value.election.electionDate,
          guides: [value],
        } as VotingGuideElection;
        result.push(electionInfo);
      } else {
        result[i]?.guides.push(value);
      }
      return result;
    }, [] as VotingGuideElection[]);
  } else return [] as VotingGuideElection[];
};

const VotingGuides: NextPage<{ mobileNavTitle?: string }> = ({
  mobileNavTitle,
}) => {
  const user = useAuth({ redirectTo: "/login" }).user; //user will not be null under this line, due to the conditional redirect
  const votingGuidesByUserId = useVotingGuidesByUserIdQuery({
    userId: user?.id || "",
  });
  const [elections, setElections] = useState<VotingGuideElection[]>([]);

  useEffect(() => {
    const { data, isError, error } = votingGuidesByUserId;
    if (isError) {
      alert("Error getting Voting Guides");
      console.error("Error getting Voting Guides", error);
    } else {
      if (data && data.votingGuidesByUserId.length) {
        const newVotingGuides =
          data.votingGuidesByUserId as VotingGuideResult[];
        const elections = getElectionsFromGuides(newVotingGuides);
        console.log("yes data", elections);
        setElections(elections);
      } else {
        votingGuidesByUserId.refetch().then((res) => {
          const elections = getElectionsFromGuides(
            res.data?.votingGuidesByUserId as VotingGuideResult[]
          );
          console.log("no data", elections);
          setElections(elections);
        });
      }
    }
  }, []);

  const upsertVotingGuide = useUpsertVotingGuideMutation();

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
            {elections.map((election) => (
              <div key={election.id}>
                <h1 className={styles.votingHeader}>{election.date}</h1>
                <h2>{election.title}</h2>
                <p className={styles.description}>{election.description}</p>
                {election.guides?.map((guide) => (
                  <VotingGuideCard guide={guide} key={guide.id} />
                ))}
              </div>
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
                  onSuccess: () => alert("Your guide was added"),
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
