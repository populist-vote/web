import { useState, useEffect } from "react";
import { NextPage } from "next";

import { Layout, MPRLogo, LoaderFlag, RaceSection } from "components";
import { useMprFeaturedRacesQuery, RaceResult } from "generated";
import styles from "./MPRElectionPage.module.scss";
import { splitRaces } from "utils/data";
import Link from "next/link";

const MPRElection: NextPage = () => {
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
        <h1 className={styles.subHeading}>2022 Election Coverage</h1>
        <h4 className={styles.racesHeading}>Highlighted Races</h4>
        <p className={styles.racesDescription}>
          Early voting is open now until November 8.{" "} 
          <Link
            href="https://www.sos.state.mn.us/elections-voting/other-ways-to-vote/vote-early-by-mail/"
            target="_blank"
            rel="noreferrer"
          >
            Request a mail-in ballot</Link> or find out where to vote{" "} 
          <Link
            href="https://pollfinder.sos.state.mn.us/"
            target="_blank"
            rel="noreferrer"
          >here</Link> — if you aren’t registered to vote, you can{" "} 
          <Link
            href="https://mnvotes.sos.state.mn.us/VoterRegistration/VoterRegistrationMain.aspx"
            target="_blank"
            rel="noreferrer"
          >register online</Link>.
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
            <p className={styles.racesDescription}>
              MPR News is here to serve your election information needs. {" "} 
              <a
                href="https://www.mprnews.org/election-2022-questions-stories"
                target="_blank"
                rel="noreferrer"
              >
              What do you want to know about the 2022 election in Minnesota?</a> You can also stay informed on the latest news about who is running and what Minnesotans are looking for in our daily{" "}
              <Link
                href="https://www.mprnews.org/capitol-view-newsletter"
                target="_blank"
                rel="noreferrer"
              >Capitol View newsletter.</Link>
            </p>
          </div>
          {races?.federal && (
            <RaceSection races={races.federal} color="aqua" title="Federal" />
          )}
        </>
      )}
    </Layout>
  );
};

export default MPRElection;
