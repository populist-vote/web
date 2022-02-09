import type { GetServerSideProps, NextPage } from "next";
import { NextParsedUrlQuery } from "next/dist/server/request-meta";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import { ScrollMenu, VisibilityContext } from "react-horizontal-scrolling-menu";
import { dehydrate, QueryClient } from "react-query";
import { PartyAvatar } from "../../components/Avatar/Avatar";
import Layout from "../../components/Layout/Layout";
import { LoaderFlag } from "../../components/LoaderFlag";
import { useAppContext } from "../../context/App";
import Spacer from "../../components/Spacer/Spacer";
import {
  PoliticalParty,
  PoliticianBySlugQuery,
  usePoliticianBySlugQuery,
} from "../../generated";
import styles from "../../styles/politicianPage.module.scss";
import states from "./states"
function LeftArrow() {
  const { isFirstItemVisible, scrollPrev } = useContext(VisibilityContext);

  return (
    <button disabled={isFirstItemVisible} onClick={() => scrollPrev()}>
      Left
    </button>
  );
}

function RightArrow() {
  const { isLastItemVisible, scrollNext } = useContext(VisibilityContext);

  return (
    <button disabled={isLastItemVisible} onClick={() => scrollNext()}>
      Right
    </button>
  );
}

const PoliticianPage: NextPage<{ mobileNavTitle?: string }> = ({
  mobileNavTitle,
}: {
  mobileNavTitle?: string;
}) => {
  const { query } = useRouter();
  const slug = query.slug as string;
  const { data, isLoading, error } = usePoliticianBySlugQuery({ slug });
  const { dispatch } = useAppContext();

  if (isLoading) return <LoaderFlag />;

  if (error) return <p>Error: {error}</p>;

  const politician = data?.politicianBySlug;

  console.log(data)

  const sponsoredBills = politician?.sponsoredBills;

  const getYear = (date: string) => {
    return new Date(date).getFullYear();
  };

  const termStart = getYear(
    politician?.votesmartCandidateBio.office?.termStart as string
  );

  const termEnd = getYear(
    politician?.votesmartCandidateBio.office?.termEnd as string
  );

  const endorsements = politician?.endorsements;

  function HeaderSection() {
    return (
      <section className={styles.center}>
        <PartyAvatar
          badgeSize={"3.125rem"}
          badgeFontSize={"2rem"}
          size={"12.5rem"}
          party={politician?.officeParty as PoliticalParty}
          src={politician?.votesmartCandidateBio.candidate.photo}
        />
      </section>
    )
  }

  function BasicInfoSection() {
    return (
      <section className={styles.center}>
        <h1 className={styles.politicianOffice}>{politician?.votesmartCandidateBio.office?.name[0]}</h1>
        {politician?.homeState && (<h2>{states[politician?.homeState]}</h2>)}
        {!!termStart && (
          <p className={styles.flexBetween}>
            <span>Assumed Office</span>
            <span className={styles.dots} />
            <span>{termStart}</span>
          </p>
        )}
        {!!termEnd && (
          <p className={styles.flexBetween}>
            <span>Term Ends</span>
            <span className={styles.dots} />
            <span>{termEnd}</span>
          </p>
        )}
        {/* <p className={styles.flexBetween}>
            <span>Elections Won / Lost</span>
            <span className={styles.dots} />
            <span>-</span>
          </p>
          <p className={styles.flexBetween}>
            <span>Years in Public Office</span>
            <span className={styles.dots} />
            <span>-</span>
          </p> */}
      </section>
    )
  }

  function ElectionInfoSection() {
    return (
      <section className={styles.center}>
        <h3>Next Election</h3>
        <div className={styles.roundedCard}>
          <h2>Primary</h2>
          <h1>Jun 28, 2022</h1>
        </div>
        <h3>Running For</h3>
        <div className={styles.roundedCard}>
          <h2>Colorado</h2>
          <h1>U.S. Senate</h1>
        </div>
        <h3>Opponent</h3>
        <div className={styles.roundedCard}>
          <h2>None</h2>
        </div>
      </section>
    );
  }

  function CommitteesSection() {
    return (
      <section className={styles.center}>
        <h3>Committees</h3>
        <div className={styles.horizontalScrollContainer}>
          <ScrollMenu>
            <div className={styles.tagPage} key={1}>
              <div className={styles.tag}>
                Conservation, Forestry, Environment, Etc. Long Long Long
              </div>
              <div className={styles.tag}>Economy</div>
              <div className={styles.tag}>Finance</div>
              <div className={styles.tag}>
                Conservation, Forestry, Environment, Etc. Long Long Long
              </div>
            </div>
            <div className={styles.tagPage} key={1}>
              <div className={styles.tag}>
                Conservation, Forestry, Environment, Etc. Long Long Long
              </div>
              <div className={styles.tag}>
                Conservation, Forestry, Environment, Etc. Long Long Long
              </div>
              <div className={styles.tag}>
                Conservation, Forestry, Environment, Etc. Long Long Long
              </div>
              <div className={styles.tag}>
                Conservation, Forestry, Environment, Etc. Long Long Long
              </div>
            </div>
          </ScrollMenu>
        </div>
      </section>
    );
  }

  function SponsoredBillsSection() {
    return (
      <section className={styles.center}>
        <h3>Sponsored Bills</h3>
        {sponsoredBills && (
          <div className={styles.horizontalScrollContainer}>
            <ScrollMenu>
              {sponsoredBills.map((bill) => (
                <div className={styles.billCard} key={bill.billNumber}>
                  <div className={styles.cardContent}>
                    <h1>{bill.billNumber}</h1>
                    <h2>{bill.title}</h2>
                    <span className={styles.statusPill}>
                      {bill.legislationStatus}
                    </span>
                  </div>
                </div>
              ))}
            </ScrollMenu>
          </div>
        )}
      </section>
    );
  }

  function EndorsementsSection() {
    if (!endorsements) return null;
    return (
      <section className={styles.center}>
        <h3 className={styles.gradientHeader}>Endorsements</h3>
        <h3>Organizations</h3>
        <div className={styles.horizontalScrollContainer}>
          <ScrollMenu>
            {endorsements.map((organization) => (
              <Link
                href={`/organizations/${slug}`}
                key={organization.id}
                passHref
              >
                <div className={styles.organizationContainer}>
                  {organization.thumbnailImageUrl ? (
                    <div className={styles.organizationAvatar}>
                      <Image
                        src={organization.thumbnailImageUrl}
                        alt={organization.name}
                        width={50}
                        height={50}
                      />
                    </div>
                  ) : (
                    <span>No Image</span>
                  )}
                  <h4>{organization.name}</h4>
                </div>
              </Link>
            ))}
          </ScrollMenu>
        </div>
      </section>
    );
  }

  return (
    <Layout mobileNavTitle={mobileNavTitle} showNavBackButton>
      <div className={styles.container}>
        <HeaderSection />
        <BasicInfoSection />
        <ElectionInfoSection />
        <CommitteesSection />
        <SponsoredBillsSection />
        <EndorsementsSection />
      </div>
    </Layout>
  );
};

export default PoliticianPage;

interface Params extends NextParsedUrlQuery {
  slug: string;
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { slug } = ctx.params as Params;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(
    usePoliticianBySlugQuery.getKey({ slug }),
    usePoliticianBySlugQuery.fetcher({ slug })
  );
  let state = dehydrate(queryClient);

  let data = state.queries[0].state.data as PoliticianBySlugQuery;

  return {
    notFound: state.queries.length === 0,
    props: {
      dehydratedState: state,
      mobileNavTitle: data.politicianBySlug.fullName,
    },
  };
};
