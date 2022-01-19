import type { GetServerSideProps, NextPage } from "next";
import Layout from "../../components/Layout/Layout";
import styles from "../../components/Layout/Layout.module.scss";
import { FaSearch } from "react-icons/fa";
import { PoliticalParty, useAllPoliticiansQuery } from "../../generated";
import type { AllPoliticiansQuery, PoliticianResult } from "../../generated";
import { LoaderFlag } from "../../components/LoaderFlag";
import { PartyAvatar } from "../../components/Avatar/Avatar";
import Link from "next/link";
import useDeviceInfo from "../../hooks/useDeviceInfo";
import Spacer from "../../components/Spacer/Spacer";
import { useState } from "react";
import { dehydrate, QueryClient } from "react-query";
import Head from "next/head";

const PoliticianRow = ({
  politician,
}: {
  politician: AllPoliticiansQuery["allPoliticians"][0];
}) => {
  const { isMobile } = useDeviceInfo();

  const officeTitle = politician.votesmartCandidateBio.office?.title;
  const officeInfo = () => {
    switch (officeTitle) {
      case "Senator":
        return "U.S. CONGRESS";
      case "Representative":
        return "U.S. HOUSE";
      default:
        return officeTitle;
    }
  };
  const district = politician.votesmartCandidateBio.office?.district;

  const districtDisplay =
    !district || isNaN(+district) ? district : `DISTRICT ${district}`;

  return (
    <Link href={`/politicians/${politician.slug}`} passHref>
      <li className={styles.rowItem}>
        <PartyAvatar
          size="60"
          party={politician.officeParty || ("UNKNOWN" as PoliticalParty)}
          src={politician.votesmartCandidateBio.candidate.photo}
          alt={politician.fullName}
        />
        <div className={styles.politicianInfo}>
          <p style={{ margin: 0 }}>{politician.fullName}</p>
          {isMobile ? (
            <div className={`${styles.bold} ${styles.flexBetween}`}>
              {district && (
                <>
                  <span>{districtDisplay}</span>
                  <Spacer size={8} delimiter="•" />
                </>
              )}

              <span>{officeInfo()}</span>
            </div>
          ) : (
            <>
              <span className={styles.bold}>{districtDisplay}</span>
              <span className={styles.bold}>{officeInfo()}</span>
            </>
          )}
        </div>
      </li>
    </Link>
  );
};

const PoliticianIndex: NextPage = () => {
  // TODO use `politicians` query with search params and accept user selected filters
  // instead of filtering clientside.
  const { data, isLoading, error } = useAllPoliticiansQuery();

  const { isMobile } = useDeviceInfo();

  type LocalityFilter = "all" | "federal" | "state";
  type ChamberFilter = "all" | "house" | "senate";

  const [searchQuery, setSearchQuery] = useState<string | null>(null);
  const [localityFilter, setLocalityFilter] = useState<LocalityFilter>("all");
  const [chamberFilter, setChamberFilter] = useState<ChamberFilter>("all");

  const localityFilterFn = (
    politician: PoliticianResult,
    scope: LocalityFilter
  ) => {
    let officeType = politician.votesmartCandidateBio.office?.typeField;
    switch (scope) {
      case "all":
        return politician;
      case "federal":
        if (officeType === "Congressional") {
          return politician;
        } else return null;
      case "state":
        if (officeType === "State Legislative") {
          return politician;
        } else return null;
    }
  };

  const chamberFilterFn = (
    politician: PoliticianResult,
    scope: ChamberFilter
  ) => {
    const officeTitle = politician.votesmartCandidateBio.office?.title;
    switch (scope) {
      case "house":
        if (officeTitle === "Representative") {
          return politician;
        } else return null;
      case "senate":
        if (officeTitle === "Senator") {
          return politician;
        } else return null;
      default:
        return politician;
    }
  };

  return (
    <>
      <Head>
        <title>Populist - Politician Browser</title>
        <meta
          name="description"
          content="Find information on your government representatives like voting histories, endorsements, and financial data."
        />
      </Head>
      <Layout>
        <div className={`${styles.stickyMainHeader} ${styles.shadow}`}>
          {!isMobile && <h1>Colorado Legislators</h1>}

          {/* <div className={styles.mb3}>
          <p>Find your legislators by entering your address.</p>
          <input placeholder="Enter address"></input>
          <button>Search</button>
        </div> */}
          <div className={styles.filtersContainer}>
            {!isMobile && <h2>Browse</h2>}
            <div className={styles.inputWithIcon}>
              <input
                placeholder="Search"
                onChange={(e) => setSearchQuery(e.target.value)}
              ></input>
              <FaSearch color="var(--blue)" />
            </div>
            <Spacer size={16} axis="vertical" />
            <form className={`${styles.flexBetween}`}>
              <input
                name="scope"
                id="federal-radio"
                type="radio"
                value="federal"
                checked={localityFilter === "federal"}
                onChange={(e) =>
                  setLocalityFilter(e.target.value as LocalityFilter)
                }
              />
              <label htmlFor="federal-radio" className={styles.radioLabel}>
                Federal
              </label>
              <input
                name="scope"
                id="state-radio"
                type="radio"
                value="state"
                checked={localityFilter === "state"}
                onChange={(e) =>
                  setLocalityFilter(e.target.value as LocalityFilter)
                }
              />
              <label htmlFor="state-radio" className={styles.radioLabel}>
                State
              </label>
              <select
                name="chamber"
                onChange={(e) =>
                  setChamberFilter(e.target.value as ChamberFilter)
                }
              >
                <option value="all">All Chambers</option>
                <option value="house">House</option>
                <option value="senate">Senate</option>
              </select>
            </form>
          </div>
        </div>
        <div>
          {isLoading && <LoaderFlag />}
          {error && (
            <h4>Something went wrong fetching politician records...</h4>
          )}
          <div>
            {data &&
              data.allPoliticians
                .filter((p) =>
                  localityFilterFn(p as PoliticianResult, localityFilter)
                )
                .filter((p) =>
                  chamberFilterFn(p as PoliticianResult, chamberFilter)
                )
                .filter((p) =>
                  p.fullName
                    .toLowerCase()
                    .includes(searchQuery?.toLowerCase() || "")
                )
                .map((politician) => (
                  <PoliticianRow politician={politician} key={politician.id} />
                ))}
          </div>
        </div>
      </Layout>
    </>
  );
};

export default PoliticianIndex;

export const getServerSideProps: GetServerSideProps = async () => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(
    useAllPoliticiansQuery.getKey(),
    useAllPoliticiansQuery.fetcher()
  );

  let state = JSON.parse(JSON.stringify(dehydrate(queryClient)));

  return {
    props: {
      dehydratedState: state,
    },
  };
};
