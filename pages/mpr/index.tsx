import { useState, useEffect } from "react";
import { NextPage } from "next";

import { Layout, MPRLogo, LoaderFlag, RaceSection } from "components";
import { useMprFeaturedRacesQuery, RaceResult } from "generated";
import styles from "./MPRElectionPage.module.scss";
import { splitRaces } from "utils/data";

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
          Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget
          lacinia odio sem nec elit. Cras mattis consectetur purus sit amet
          fermentum. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
        </p>
      </div>

      {isLoading ? (
        <LoaderFlag />
      ) : (
        <>
          {races?.federal && (
            <RaceSection races={races.federal} color="aqua" title="Federal" />
          )}
          {races?.state && (
            <RaceSection races={races.state} color="yellow" title="Federal" />
          )}
        </>
      )}
    </Layout>
  );
};

export default MPRElection;
