import { useState, useEffect } from "react";

import { Layout, MPRLogo, LoaderFlag, RaceSection, Button } from "components";
import { useMprFeaturedRacesQuery, RaceResult } from "generated";
import styles from "./MPRElectionPage.module.scss";
import { splitRaces } from "utils/data";
import Link from "next/link";

export function getServerSideProps() {
  return {
    props: {
      title: "MPR News | Minnesota 2022 Election",
      description:
        "Find information on your government representatives like voting histories, endorsements, and financial data.",
    },
  };
}

function MPRElectionPage() {
  const { data, isLoading, isError } = useMprFeaturedRacesQuery();

  const [races, setRaces] = useState<ReturnType<typeof splitRaces>>();

  useEffect(() => {
    if (!isLoading && data?.races) {
      setRaces(splitRaces(data.races as RaceResult[]));
    }
  }, [isLoading, data, setRaces]);

  if (isError)
    return (
      <Layout>
        <h1>Error</h1>
        <h2>Please reload</h2>
      </Layout>
    );

  return (
    <Layout>
      <div className={styles.mprHeader}>
        <h1 className={styles.mprLogo}>
          <MPRLogo height={80} />
        </h1>
        <h1 className={styles.subHeading}>
          Build Your 2022 MN Election Ballot
        </h1>
        <h4 className={styles.racesHeading}>Highlighted Races</h4>

        <p>
          MPR News has highlighted some of the important races happening in
          Minnesota this election - check out the candidates below, then view
          what's on your ballot and create your own personalized voting guide to
          share with others.
        </p>
        <p className={styles.cta}>
          <Link href="/ballot" passHref>
            <Button
              variant="primary"
              size="large"
              label="View your ballot"
            ></Button>
          </Link>
        </p>
        <p>
          Got more questions about the election?{" "}
          <a
            href="https://www.mprnews.org/election-2022-questions-stories"
            target="_blank"
            rel="noopener noreferrer"
          >
            Share them with us
          </a>
          , and stay informed on the latest news about who is running and what
          Minnesotans are looking for in our daily{" "}
          <a
            href="https://www.mprnews.org/capitol-view-newsletter"
            target="_blank"
            rel="noopener noreferrer"
          >
            Capitol View newsletter.
          </a>
        </p>
      </div>

      {isLoading ? (
        <LoaderFlag />
      ) : (
        <>
          {races?.state && (
            <RaceSection races={races.state} color="yellow" title="State" />
          )}
          <div className={styles.mprBody}>
            <p>
              Early voting is open now until November 8.{" "}
              <a
                href="https://www.sos.state.mn.us/elections-voting/other-ways-to-vote/vote-early-by-mail/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Request a mail-in ballot
              </a>{" "}
              or find out where to vote{" "}
              <a
                href="https://pollfinder.sos.state.mn.us/"
                target="_blank"
                rel="noopener noreferrer"
              >
                here
              </a>{" "}
              — if you aren’t registered to vote, you can{" "}
              <a
                href="https://mnvotes.sos.state.mn.us/VoterRegistration/VoterRegistrationMain.aspx"
                target="_blank"
                rel="noopener noreferrer"
              >
                register online
              </a>
              .
            </p>
          </div>
          {races?.federal && (
            <RaceSection races={races.federal} color="aqua" title="Federal" />
          )}
        </>
      )}
    </Layout>
  );
}

export default MPRElectionPage;
