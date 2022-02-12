import type { GetServerSideProps, NextPage } from "next";
import { NextParsedUrlQuery } from "next/dist/server/request-meta";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { dehydrate, QueryClient } from "react-query";

import { BillCard, Layout, LoaderFlag, PartyAvatar } from "components";

// Note: this is a dynamic import because the react-horizontal-scrolling-menu
// uses useLayoutEffect which is not supported by the server.
const Scroller = dynamic(() => import("components/Scroller/Scroller"), {
  ssr: false,
});

import {
  OrganizationResult,
  PoliticalParty,
  PoliticianBySlugQuery,
  PoliticianResult,
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

  if (isLoading) return <LoaderFlag />;
  if (error) return <p>Error: {error}</p>;
  const politician = data?.politicianBySlug;
  if (!politician) return <p>No politician found</p>;

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
  const yearsInPublicOffice = politician?.yearsInPublicOffice;

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
        {/* Dont have this datapoint yet */}
        {/* <p className={styles.flexBetween}>
          <span>Elections Won / Lost</span>
          <span className={styles.dots} />
          <span>-</span>
        </p> */}
        {!!yearsInPublicOffice && (
          <p className={styles.flexBetween}>
            <span>Years in Public Office</span>
            <span className={styles.dots} />
            <span>{yearsInPublicOffice}</span>
          </p>
        )}
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
    const tags =
      politician?.votesmartCandidateBio?.candidate?.congMembership?.experience?.map(
        (committee: any) =>
          committee.organization.replace("Subcommittee on", "")
      ) ?? [];

    const tagPageSize = 4;
    const tagPages: string[][] = Array(Math.ceil(tags.length / tagPageSize))
      .fill("")
      .map((_, index) => index * tagPageSize)
      .map((begin) => tags.slice(begin, begin + tagPageSize));

    if (tags.length === 0) return null;

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
              <BillCard bill={bill} key={bill.slug} />
            ))}
          </Scroller>
        )}
      </section>
    );
  }

  function OrganizationEndorsement({
    organization,
  }: {
    organization: Partial<OrganizationResult>;
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

  function PoliticianEndorsement({
    politician,
  }: {
    politician: Partial<PoliticianResult>;
  }) {
    return (
      <Link
        href={`/politicians/${politician.slug}`}
        key={politician.id}
        passHref
      >
        <div className={styles.organizationContainer}>
          <PartyAvatar
            party={(politician.officeParty as PoliticalParty) || "DEMOCRATIC"}
            src={politician?.votesmartCandidateBio?.candidate.photo as string}
          />
          <h4>{politician.fullName}</h4>
        </div>
      </Link>
    );
  }

  console.log(endorsements.politicians);

  function EndorsementsSection() {
    if (!endorsements?.organizations && !endorsements?.politicians) return null;
    return (
      <section className={styles.center}>
        {endorsements.organizations.length > 0 && (
          <>
            <h3 className={styles.gradientHeader}>Endorsements</h3>
            <h3>Organizations</h3>
            <Scroller>
              {endorsements.organizations.map((organization) => (
                <OrganizationEndorsement
                  organization={organization}
                  key={organization.slug}
                />
              ))}
            </Scroller>
          </>
        )}
        {endorsements.politicians.length > 0 && (
          <>
            <h3>Individuals</h3>
            <Scroller>
              {endorsements.politicians.map((politician) => (
                <PoliticianEndorsement
                  politician={politician as Partial<PoliticianResult>}
                  key={politician.slug}
                />
              ))}
            </Scroller>
          </>
        )}
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
