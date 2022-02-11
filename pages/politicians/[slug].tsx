import type { GetServerSideProps, NextPage } from "next";
import { NextParsedUrlQuery } from "next/dist/server/request-meta";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import { dehydrate, QueryClient } from "react-query";

import {
  BillCard,
  Layout,
  LoaderFlag,
  PartyAvatar,
  Scroller,
  Spacer,
} from "components";

import { useAppContext } from "context/App";

import {
  PoliticalParty,
  PoliticianBySlugQuery,
  usePoliticianBySlugQuery,
} from "../../generated";

import styles from "styles/politicianPage.module.scss";

import states from "util/states";

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
    );
  }

  function BasicInfoSection() {
    return (
      <section className={styles.center}>
        <h1 className={styles.politicianOffice}>
          {politician?.votesmartCandidateBio.office?.name[0]}
        </h1>
        {politician?.homeState && <h2>{states[politician?.homeState]}</h2>}
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
    );
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

  function CommitteeTagPage({
    tags,
    itemId,
  }: {
    tags: string[];
    itemId: string;
  }) {
    return (
      <div className={styles.tagPage}>
        {tags.map((tag, index) => (
          <CommitteeTag tag={tag} key={`${tag}${index}`} />
        ))}
      </div>
    );
  }

  function CommitteeTag({ tag }: { tag: string }) {
    return <div className={styles.tag}>{tag}</div>;
  }

  function CommitteesSection() {
    // TODO Replace with data here
    const tags = [
      "Conservation, Forestry, Environment, Etc. Long Long Long",
      "Economy",
      "Finance",
      "Conservation, Forestry, Environment, Etc. Long Long Long",
      "Conservation, Forestry, Environment, Etc. Long Long Long",
      "Conservation, Forestry, Environment, Etc. Long Long Long",
      "Conservation, Forestry, Environment, Etc. Long Long Long",
      "Conservation, Forestry, Environment, Etc. Long Long Long",
    ];

    const tagPageSize = 4;
    const tagPages: string[][] = Array(Math.ceil(tags.length / tagPageSize))
      .fill("")
      .map((_, index) => index * tagPageSize)
      .map((begin) => tags.slice(begin, begin + tagPageSize));

    return (
      <section className={styles.center}>
        <h3>Committees</h3>
        <Scroller>
          {tagPages.map((tagPage, index) => (
            <CommitteeTagPage
              tags={tagPage}
              key={`tagPage-${index}`}
              itemId={`tagPage-${index}`}
            />
          ))}
        </Scroller>
      </section>
    );
  }

  function SponsoredBillsSection() {
    return (
      <section className={styles.center}>
        <h3>Sponsored Bills</h3>
        {sponsoredBills && (
          <Scroller>
            {sponsoredBills.map((bill) => (
              <BillCard
                bill={bill}
                key={bill.billNumber}
                itemId={bill.billNumber}
              />
            ))}
          </Scroller>
        )}
      </section>
    );
  }

  function Endorsement({
    organization,
    itemId,
  }: {
    organization: {
      id: string;
      slug: string;
      name: string;
      thumbnailImageUrl?: string | null;
    };
    itemId: string;
  }) {
    return (
      <Link
        href={`/organizations/${organization.slug}`}
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
    );
  }

  function EndorsementsSection() {
    if (!endorsements) return null;
    return (
      <section className={styles.center}>
        <h3 className={styles.gradientHeader}>Endorsements</h3>
        <h3>Organizations</h3>
        <Scroller>
          {endorsements.organizations.map((organization) => (
            <Endorsement
              organization={organization}
              key={organization.slug}
              itemId={organization.slug}
            />
          ))}
        </Scroller>
      </section>
    );
  }

  return (
    <Layout
      mobileNavTitle={mobileNavTitle}
      showNavBackButton
      showNavLogoOnMobile={false}
    >
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
