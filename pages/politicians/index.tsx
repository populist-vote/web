import type { NextPage } from 'next';
import Layout from '../../components/Layout/Layout';
import styles from '../../components/Layout/Layout.module.scss';
import { FaSearch } from 'react-icons/fa';
import { PoliticalParty, useAllPoliticiansQuery } from '../../generated';
import type { AllPoliticiansQuery, PoliticianResult } from '../../generated';
import { LoaderFlag } from '../../components/LoaderFlag';
import { PartyAvatar } from '../../components/Avatar/Avatar';
import { useLayoutEffect } from 'react';
import Link from 'next/link';

const PoliticianRow = ({
  politician,
}: {
  politician: AllPoliticiansQuery['allPoliticians'][0];
}) => {
  return (
    <Link href={`/politicians/${politician.slug}`} passHref>
      <li className={styles.rowItem}>
        <PartyAvatar
          party={politician.officeParty || ('UNKNOWN' as PoliticalParty)}
          src={politician.votesmartCandidateBio.candidate.photo}
          alt={politician.fullName}
        />
        <h3>{politician.fullName}</h3>
      </li>
    </Link>
  );
};

const PoliticianIndex: NextPage = () => {
  const { data, isLoading, error } = useAllPoliticiansQuery();

  return (
    <Layout>
      <div className={`${styles.stickyMainHeader} ${styles.shadow}`}>
        <h1>Colorado Legislators</h1>
        <p>Find your legislators by entering your address.</p>
        <div className={styles.mb3}>
          <input className={styles.wide} placeholder="Enter address"></input>
          <span style={{ margin: '0 0.5rem' }} />
          <button>Search</button>
        </div>
        <hr />
        <h2>Browse</h2>
        <div className={`${styles.mb3}, ${styles.flexBetween}`}>
          <div>
            <button>Federal</button>
            <span style={{ margin: '0 0.5rem' }} />
            <button>State</button>
            <span className={styles.verticalDivider} />
            <select name="chamber">
              <option value="all">All Chambers</option>
              <option value="house">House</option>
              <option value="senate">Senate</option>
            </select>
          </div>
          <div className={styles.inputWithIcon}>
            <input placeholder="Search"></input>
            <FaSearch color="var(--blue)" />
          </div>
        </div>
        <hr />
      </div>

      <div className={styles.fixedScrollable}>
        {isLoading && <LoaderFlag />}
        {error && <h4>Something went wrong fetching politician records...</h4>}
        {data &&
          data.allPoliticians.map((politician) => (
            <PoliticianRow politician={politician} key={politician.id} />
          ))}
      </div>
    </Layout>
  );
};

export default PoliticianIndex;
