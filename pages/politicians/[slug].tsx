import type { GetServerSideProps, NextPage } from "next";
import { NextParsedUrlQuery } from "next/dist/server/request-meta";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { dehydrate, QueryClient } from "react-query";
import { BillCard, Layout, LoaderFlag, PartyAvatar } from "components";

// Note: this is a dynamic import because the react-horizontal-scrolling-menu
// uses useLayoutEffect which is not supported by the server.
const Scroller = dynamic(() => import("components/Scroller/Scroller"), {
  ssr: false,
});

import {
  BillResult,
  OrganizationResult,
  PoliticalParty,
  PoliticianBySlugQuery,
  PoliticianResult,
  RatingResult,
  RatingResultEdge,
  usePoliticianBySlugQuery,
} from "../../generated";

import styles from "styles/page.module.scss";
import layoutStyles from "../../components/Layout/Layout.module.scss";

import states from "utils/states";

import { computeShortOfficeTitle } from "utils/politician";
import {
  ORGANIZATION_FALLBACK_IMAGE_URL,
  PERSON_FALLBACK_IMAGE_URL,
} from "utils/constants";
import { OrganizationAvatar } from "components/Avatar/Avatar";
import { dateString } from "utils/dates";

const PoliticianPage: NextPage<{ mobileNavTitle?: string }> = ({
  mobileNavTitle,
}: {
  mobileNavTitle?: string;
}) => {
  const { query } = useRouter();
  const slug = query.slug as string;
  const { data, isLoading, error } = usePoliticianBySlugQuery(
    { slug },
    {
      refetchOnWindowFocus: false,
      staleTime: Infinity,
    }
  );

  if (isLoading) return <LoaderFlag />;
  if (error) return <>Error: {error}</>;
  const politician = data?.politicianBySlug;
  if (!politician) return <p>No politician found</p>;

  const getYear = (date: string) => {
    return new Date(date).getFullYear();
  };

  const termStart = getYear(
    politician?.votesmartCandidateBio?.office?.termStart as string
  );
  const termEnd = getYear(
    politician?.votesmartCandidateBio?.office?.termEnd as string
  );
  const sponsoredBills = politician?.sponsoredBills || { edges: [] };
  const yearsInPublicOffice = politician?.yearsInPublicOffice;
  const age = politician?.age;
  const endorsements = politician?.endorsements;
  const upcomingRace = politician?.upcomingRace;
  const ratings = politician?.ratings.edges as Array<RatingResultEdge>;
  const opponents =
    upcomingRace?.candidates.filter(
      (candidate) => candidate.id != politician.id
    ) || [];

  function HeaderSection() {
    return (
      <section className={styles.center}>
        <PartyAvatar
          badgeSize={"2.5rem"}
          badgeFontSize={"1.5rem"}
          size={160}
          party={politician?.party || ("UNKNOWN" as PoliticalParty)}
          src={
            (politician?.thumbnailImageUrl ||
              politician?.votesmartCandidateBio?.candidate.photo) as string
          }
          fallbackSrc={PERSON_FALLBACK_IMAGE_URL}
          alt={politician?.fullName as string}
        />
      </section>
    );
  }

  function BasicInfoSection() {
    return (
      <section className={styles.center}>
        <h1 className={styles.politicianOffice}>
          {politician?.votesmartCandidateBio?.office?.name[0]}
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
        {/* Dont have this data yet */}
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
        {!!age && (
          <p className={styles.flexBetween}>
            <span>Age</span>
            <span className={styles.dots} />
            <span>{age}</span>
          </p>
        )}
      </section>
    );
  }

  function Candidate({
    candidate,
  }: {
    candidate: Partial<PoliticianResult>;
    itemId: string;
  }) {
    return (
      <Link href={`/politicians/${candidate.slug}`} key={candidate.id} passHref>
        <div className={layoutStyles.avatarContainer}>
          <PartyAvatar
            size={60}
            party={candidate.party || ("UNKNOWN" as PoliticalParty)}
            src={candidate.thumbnailImageUrl || PERSON_FALLBACK_IMAGE_URL}
            fallbackSrc={PERSON_FALLBACK_IMAGE_URL}
            alt={politician?.fullName || ""}
          />
          <h4>{candidate.fullName}</h4>
        </div>
      </Link>
    );
  }

  function ElectionInfoSection() {
    if (!upcomingRace) return null;
    return (
      <section className={styles.center}>
        <h3 className={styles.subHeader}>Next Election</h3>
        <div className={styles.roundedCard}>
          <h2>{upcomingRace?.title}</h2>
          <h1>{dateString(upcomingRace?.electionDate)}</h1>
        </div>
        <h3>Running For</h3>
        <div className={styles.roundedCard}>
          {upcomingRace?.state && <h2>{states[upcomingRace.state]}</h2>}
          <h1>{upcomingRace?.office.title}</h1>
        </div>
        {opponents.length > 0 && (
          <>
            <h3>Opponent{opponents.length > 1 && "s"}</h3>
            <div className={`${styles.roundedCard} ${styles.flexEvenly}`}>
              <Scroller>
                {upcomingRace.candidates
                  .filter((candidate) => candidate.id != politician.id)
                  .map(
                    (candidate: Partial<PoliticianResult> & { id: string }) => {
                      return (
                        <Candidate
                          candidate={candidate}
                          itemId={candidate.id}
                          key={candidate.id}
                        />
                      );
                    }
                  )}
              </Scroller>
            </div>
          </>
        )}
      </section>
    );
  }

  function CommitteeTagPage({ tags }: { tags: string[]; itemId: string }) {
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
    const politicalExperience =
      politician?.votesmartCandidateBio?.candidate?.congMembership?.experience;

    // Votesmart data is very poorly typed, sometimes we get a string here so we need this check
    const tags =
      politicalExperience?.constructor === Array
        ? politicalExperience.map((committee: { organization: string }) =>
            committee?.organization?.replace("Subcommittee on", "")
          )
        : [];

    const tagPageSize = 4;
    const tagPages: string[][] = Array(Math.ceil(tags.length / tagPageSize))
      .fill("")
      .map((_, index) => index * tagPageSize)
      .map((begin) => tags.slice(begin, begin + tagPageSize));

    if (tags.length === 0) return null;

    return (
      <section className={styles.center}>
        <h3 className={styles.subHeader}>Committees</h3>
        <Scroller onePageAtATime>
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
    if (
      sponsoredBills &&
      sponsoredBills.edges &&
      sponsoredBills.edges.length > 0
    ) {
      const edges =
        (sponsoredBills.edges as Array<{ node: Partial<BillResult> }>) || [];
      return (
        <section className={styles.center}>
          <h3 className={styles.subHeader}>Sponsored Bills</h3>
          <Scroller onePageAtATime>
            {edges
              .map((edge) => {
                return (
                  <BillCard
                    bill={edge.node}
                    key={edge.node.slug}
                    itemId={edge.node.slug as string}
                  />
                );
              })
              .filter((x) => x)}
          </Scroller>
        </section>
      );
    } else {
      return null;
    }
  }

  function OrganizationEndorsement({
    organization,
  }: {
    organization: Partial<OrganizationResult>;
    itemId: string;
  }) {
    return (
      <Link
        href={`/organizations/${organization.slug}`}
        key={organization.id}
        passHref
      >
        <div className={styles.organizationContainer}>
          <OrganizationAvatar
            src={organization.thumbnailImageUrl as string}
            fallbackSrc={ORGANIZATION_FALLBACK_IMAGE_URL}
            alt={organization.name as string}
            size={80}
          />

          <h4>{organization.name}</h4>
        </div>
      </Link>
    );
  }

  function PoliticianEndorsement({
    politician,
  }: {
    politician: Partial<PoliticianResult>;
    itemId: string;
  }) {
    const officeTitle = useMemo(
      () => computeShortOfficeTitle(politician),
      [politician]
    );
    return (
      <Link
        href={`/politicians/${politician.slug}`}
        key={politician.id}
        passHref
      >
        <div className={styles.organizationContainer}>
          <PartyAvatar
            party={(politician.party as PoliticalParty) || "DEMOCRATIC"}
            src={politician?.thumbnailImageUrl as string}
            fallbackSrc={PERSON_FALLBACK_IMAGE_URL}
            alt={politician?.fullName as string}
            size={80}
          />
          <h4>{politician.fullName}</h4>
          {officeTitle && (
            <span className={styles.politicianEndorsementOffice}>
              {officeTitle}
            </span>
          )}
        </div>
      </Link>
    );
  }

  function EndorsementsSection() {
    if (
      [
        ...(endorsements?.organizations ?? []),
        ...(endorsements?.politicians ?? []),
      ].length < 1
    )
      return null;
    return (
      <section className={styles.center}>
        <h3 className={styles.gradientHeader}>Endorsements</h3>
        {endorsements.organizations.length > 0 && (
          <>
            <h3 className={`${styles.subHeader} ${styles.aqua}`}>
              Organizations
            </h3>
            <Scroller>
              {endorsements.organizations.map((organization) => (
                <OrganizationEndorsement
                  organization={organization}
                  key={organization.slug}
                  itemId={organization.slug}
                />
              ))}
            </Scroller>
          </>
        )}
        {endorsements.politicians.length > 0 && (
          <>
            <h3 className={`${styles.subHeader} ${styles.aqua}`}>
              Individuals
            </h3>
            <Scroller>
              {endorsements.politicians.map((politician) => (
                <PoliticianEndorsement
                  politician={politician as Partial<PoliticianResult>}
                  key={politician.slug}
                  itemId={politician.slug}
                />
              ))}
            </Scroller>
          </>
        )}
      </section>
    );
  }

  function RatingsItem({ rating }: { rating: RatingResult; itemId: string }) {
    const ratingPercent = parseInt(rating.vsRating.rating);

    return (
      <div className={styles.ratingContainer} key={rating?.vsRating.ratingId}>
        <div className={styles.circlesContainer}>
          <OrganizationAvatar
            src={rating?.organization?.thumbnailImageUrl as string}
            fallbackSrc={ORGANIZATION_FALLBACK_IMAGE_URL}
            alt={rating?.organization?.name as string}
            size={50}
          />
          <div
            className={styles.ratingCircle}
            style={{
              background: `${
                ratingPercent > 50 ? "var(--green)" : "var(--red)"
              }`,
            }}
          >
            <span>{ratingPercent}</span>
          </div>
        </div>
        <h5>{rating.organization?.name}</h5>
      </div>
    );
  }

  function RatingsSection() {
    if (ratings.length > 1)
      return (
        <section className={styles.center}>
          <h3 className={styles.gradientHeader}>Ratings</h3>
          <Scroller>
            {ratings.map((edge: RatingResultEdge, i) => (
              <RatingsItem
                rating={edge.node}
                key={`${edge.node.vsRating.ratingId}-${i}`}
                itemId={`${edge.node.vsRating.ratingId}-${i}`}
              />
            ))}
          </Scroller>
        </section>
      );
    return null;
  }

  // function BioSection() {
  //   return (
  //     <section className={styles.center}>
  //       <h3 className={styles.gradientHeader}>Bio</h3>
  //       <p>This is a cool politician dude.</p>
  //     </section>
  //   );
  // }

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
        <RatingsSection />
        {/* <BioSection /> */}
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
  const state = dehydrate(queryClient);

  const data = state.queries[0]?.state.data as PoliticianBySlugQuery;

  return {
    notFound: !data,
    props: {
      dehydratedState: state,
      mobileNavTitle: data?.politicianBySlug.fullName,
    },
  };
};
