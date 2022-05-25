import { useState, useEffect } from "react";
import { NextPage } from "next";
import Head from "next/head";
import { useUpsertVotingGuideMutation, useVotingGuidesByUserIdQuery, VotingGuideResult } from "generated";
import { Layout, Avatar, FlagSection, Button } from "components";
import { useAuth } from "hooks/useAuth";
import styles from "./VotingGuides.module.scss";

interface Props {
  bla?: string
}

// const formatRaceDate(date:String)

const VotingGuides: NextPage<Props> = () => {

  const user = useAuth({}).user;
  const upsertVotingGuide = useUpsertVotingGuideMutation();
  const votingGuidesByUserId = useVotingGuidesByUserIdQuery({userId:user?.id || ""});
  const [guides, setGuides] = useState<VotingGuideResult[]>([]);

  useEffect(()=>{
    const {data} = votingGuidesByUserId;
    if (user && data?.votingGuidesByUserId) {
      const newVotingGuides = data.votingGuidesByUserId as VotingGuideResult[];
      setGuides(newVotingGuides);
    }
  },[user, setGuides, votingGuidesByUserId]);
  


  return (
    <>
      <Head>
        <title>Populist - Voting Guides</title>
        <meta name="description" content="View Voting Guides." />
      </Head>

      <Layout showNavLogoOnMobile={false}>
        <FlagSection title="Voting Guides">
        {
          guides.map(guide=>{
            <div></div>

          })

        }

        <h1>June 28, 2022</h1>
        <hr />
        <h2>Colorado Primaries</h2>
        <p className={styles.smallText}>Primary elections for the general election later this year on November 8, 2022.</p>
        <div className={styles.roundedCard}>
          <div className={styles.guideContainer}>
            <div className={styles.avatarContainer}>
              <Avatar src="https://www.gravatar.com/avatar/" size={80} fallbackSrc="https://www.gravatar.com/avatar/" alt="Henry Lai" />
              <h4>Henry Lai</h4>
            </div>
            <div className={styles.buttonWrapper}>
              <Button large primary theme="blue" label="Edit">Edit</Button>
              <Button large primary theme="yellow" label="Share">Share</Button>
              <Button large theme="blue" label="Add guide" onClick={()=>{
                upsertVotingGuide.mutate({
                  title: "Zack's Guide",
                  description: "Vote or die, this is why"});
              }}>Share</Button>
            </div>
          </div>
        </div>

        </FlagSection>
      </Layout>
    </>
  );
};

export default VotingGuides;
