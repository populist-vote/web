/* eslint-disable react-hooks/exhaustive-deps */
import { ReactNode } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { usePoliticianIndexQuery } from "generated";
import { Layout, LoaderFlag, PartyAvatar, Spacer, TopNav } from "components";
import styles from "./PoliticianIndex.module.scss";

import {
  Chambers,
  PoliticalParty,
  PoliticalScope,
  State,
} from "../../generated";
import type { PoliticianResult } from "../../generated";
import useDeviceInfo from "hooks/useDeviceInfo";
import useDebounce from "hooks/useDebounce";
import { PERSON_FALLBACK_IMAGE_URL } from "utils/constants";
import { GetServerSideProps } from "next";
import { PoliticianIndexFilters } from "components/PoliticianFilters/PoliticianFilters";
import nextI18nextConfig from "next-i18next.config";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { SupportedLocale } from "types/global";
import {} from "@tanstack/react-query";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { locale } = ctx;
  return {
    props: {
      title: "Politician Browser",
      description:
        "Find information on your government representatives like voting histories, endorsements, and financial data.",
      ...ctx.query,
      ...(await serverSideTranslations(
        locale as SupportedLocale,
        ["auth", "common"],
        nextI18nextConfig
      )),
    },
  };
};

const PAGE_SIZE = 50;

const PoliticianRow = ({ politician }: { politician: PoliticianResult }) => {
  const { isMobile } = useDeviceInfo();
  const officeTitle =
    politician.currentOffice?.name || politician.currentOffice?.title;
  const officeSubtitle = politician.currentOffice?.subtitleShort;

  return (
    <Link href={`/politicians/${politician.slug}`} passHref>
      <li className={styles.rowItem}>
        <PartyAvatar
          size={60}
          party={politician.party as PoliticalParty}
          src={
            politician.assets.thumbnailImage160 ||
            (politician.votesmartCandidateBio?.candidate.photo as string)
          }
          fallbackSrc={PERSON_FALLBACK_IMAGE_URL}
          alt={politician.fullName}
        />
        <div className={styles.politicianInfo}>
          <p style={{ margin: 0 }}>{politician.fullName}</p>
          {isMobile ? (
            <div className={styles.flexBetween}>
              {officeTitle && (
                <span className={styles.bold}>
                  {politician.currentOffice?.title}
                </span>
              )}
              {officeTitle && officeSubtitle && (
                <Spacer size={8} delimiter="•" axis="horizontal" />
              )}
              {officeSubtitle && (
                <span className={styles.bold}>{officeSubtitle}</span>
              )}
            </div>
          ) : (
            <>
              <span className={styles.bold}>{officeTitle}</span>
              <span className={styles.bold}>{officeSubtitle}</span>
            </>
          )}
        </div>
      </li>
    </Link>
  );
};

export type PoliticianIndexProps = {
  query: {
    search: string;
    scope: PoliticalScope;
    chamber: Chambers;
    state: State;
  };
};

function PoliticianIndex(props: PoliticianIndexProps) {
  const router = useRouter();
  const { query } = router;
  const {
    state = null,
    scope = PoliticalScope.Federal,
    chamber = null,
    search = null,
  } = props.query || query;

  const debouncedSearchQuery = useDebounce<string | null>(
    search as string,
    350
  );

  const { data, isLoading, error } = usePoliticianIndexQuery({
    filter: {
      query: debouncedSearchQuery,
      homeState: state,
      politicalScope: scope,
      chambers: chamber,
    },
    pageSize: PAGE_SIZE,
  });

  return (
    <div className={styles.container}>
      <PoliticiansTopNav />
      <section>
        <PoliticianIndexFilters query={props.query} />
      </section>
      <div>
        <>
          {isLoading && (
            <div className={styles.center}>
              <LoaderFlag />
            </div>
          )}
          {error && (
            <h4>Something went wrong fetching politician records...</h4>
          )}
          {data?.politicians?.totalCount === 0 && (
            <div className={styles.center}>
              <p className={styles.noResults}>No Results</p>
            </div>
          )}
          <div>
            {data?.politicians?.edges?.map((edge, index) => (
              <PoliticianRow
                key={index}
                politician={edge.node as PoliticianResult}
              />
            ))}
          </div>
        </>
      </div>
    </div>
  );
}

export function PoliticiansTopNav() {
  const router = useRouter();
  const { query } = router;

  return (
    <TopNav>
      <ul>
        <li
          data-selected={router.pathname === "/politicians/my-politicians"}
          data-color="aqua"
        >
          <Link
            href={{
              pathname: "/politicians/my-politicians",
              query: {
                ...query,
              },
            }}
          >
            My Politicians
          </Link>
        </li>
        <li
          data-selected={router.pathname === "/politicians"}
          data-color="yellow"
        >
          <Link
            href={{
              pathname: "/politicians",
              query: {
                ...query,
              },
            }}
          >
            Browse
          </Link>
        </li>
      </ul>
    </TopNav>
  );
}

PoliticianIndex.getLayout = (page: ReactNode) => <Layout>{page}</Layout>;

export default PoliticianIndex;
