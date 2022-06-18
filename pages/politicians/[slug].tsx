import type { GetServerSideProps, NextPage } from "next";
import { NextParsedUrlQuery } from "next/dist/server/request-meta";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useMemo, CSSProperties, PropsWithChildren } from "react";
import { dehydrate, QueryClient } from "react-query";
import { BillCard, Button, Layout, LoaderFlag, PartyAvatar } from "components";
import { HeaderSection, ElectionInfoSection } from "components/Politician";

import { GrTree } from "react-icons/gr";
import {
  FaChair,
  FaInstagram,
  FaTwitter,
  FaFacebook,
  FaGlobe,
} from "react-icons/fa";
import { default as classNames } from "classnames";

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
import politicianStyles from "./PoliticianPage.module.scss";

import states from "utils/states";

import { computeShortOfficeTitle } from "utils/politician";
import {
  ORGANIZATION_FALLBACK_IMAGE_URL,
  PERSON_FALLBACK_IMAGE_URL,
} from "utils/constants";
import { OrganizationAvatar } from "components/Avatar/Avatar";
import { getYear } from "utils/dates";

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
  const ratings = politician?.ratings.edges as Array<RatingResultEdge>;
  const politicalExperience =
    politician?.votesmartCandidateBio?.candidate?.congMembership?.experience;

  // Votesmart data is very poorly typed, sometimes we get a string here so we need this check
  const tags =
    politicalExperience?.constructor === Array
      ? politicalExperience.map(
          (committee: {
            organization: string;
            title?: string;
            fullText: string;
          }) => ({
            text: committee?.organization
              ?.replace("Subcommittee on", "")
              .replace(", United States Senate", ""),
            fullText: committee?.fullText,
            isChair: committee?.title?.toUpperCase().indexOf("CHAIR") !== -1,
            isSubCommittee:
              committee?.organization?.toUpperCase().indexOf("SUBCOMMITTEE") !==
              -1,
          })
        )
      : [];

  function OfficeSection() {
    // if (politician.currentOffice) return null;

    const cx = classNames(
      styles.center,
      styles.borderBottom,
      styles.politicianOffice
    );
    return (
      <section className={cx}>
        <h1 className={styles.politicianOffice}>
          {politician?.currentOffice?.title ||
            politician?.votesmartCandidateBio?.office?.name[0]}
        </h1>
        {politician?.homeState && <h2>{states[politician?.homeState]}</h2>}
      </section>
    );
  }

  function BasicInfoSection() {
    const cx = classNames(styles.center, politicianStyles.basicInfo, {
      [politicianStyles.wide as string]: tags.length === 0,
    });

    if (!termStart && !termEnd && !yearsInPublicOffice && !age) return null;

    return (
      <section className={cx}>
        <h3 className={styles.subHeader}>Basic Info</h3>
        {!!termStart && (
          <p className={styles.flexBetween}>
            <span>Assumed Office</span>
            <div className={styles.dots} />
            <span>{termStart}</span>
          </p>
        )}
        {!!termEnd && (
          <p className={styles.flexBetween}>
            <span>Term Ends</span>
            <div className={styles.dots} />
            <span>{termEnd}</span>
          </p>
        )}
        {!!yearsInPublicOffice && (
          <p className={styles.flexBetween}>
            <span>Years in Public Office</span>
            <div className={styles.dots} />
            <span>{yearsInPublicOffice}</span>
          </p>
        )}
        {!!age && (
          <p className={styles.flexBetween}>
            <span>Age</span>
            <div className={styles.dots} />
            <span>{age}</span>
          </p>
        )}
        <div className={politicianStyles.links}>
          {politician?.websiteUrl && (
            <a
              aria-label={"Website"}
              href={
                politician.websiteUrl?.startsWith("http")
                  ? politician.websiteUrl
                  : `//${politician.websiteUrl}`
              }
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaGlobe />
            </a>
          )}
          {politician?.twitterUrl && (
            <a
              aria-label={"Twitter"}
              href={
                politician.twitterUrl?.startsWith("http")
                  ? politician.twitterUrl
                  : `//${politician.twitterUrl}`
              }
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaTwitter />
            </a>
          )}
          {politician?.facebookUrl && (
            <a
              aria-label={"Facebook"}
              href={
                politician.facebookUrl?.startsWith("http")
                  ? politician.facebookUrl
                  : `//${politician.facebookUrl}`
              }
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebook />
            </a>
          )}
          {politician?.instagramUrl && (
            <a
              aria-label={"Instagram"}
              href={
                politician.instagramUrl?.startsWith("http")
                  ? politician.instagramUrl
                  : `//${politician.instagramUrl}`
              }
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram />
            </a>
          )}
        </div>
      </section>
    );
  }

  type TagType = {
    text: string;
    fullText: string;
    isChair: boolean;
    isSubCommittee: boolean;
  };

  function CommitteeTagPage({
    tags,
  }: {
    tags: Array<TagType>;
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

  function CommitteeTag({ tag }: { tag: TagType }) {
    return (
      <div className={styles.tag} title={tag.fullText}>
        {tag.isChair && <FaChair color="var(--blue)" />}
        {tag.isSubCommittee && (
          <GrTree className={styles.subCommittee} color="var(--blue)" />
        )}
        <span>{tag.text}</span>
      </div>
    );
  }

  function CommitteesSection() {
    const politicalExperience =
      politician?.votesmartCandidateBio?.candidate?.congMembership?.experience;

    // Votesmart data is very poorly typed, sometimes we get a string here so we need this check
    const tags =
      politicalExperience?.constructor === Array
        ? politicalExperience.map(
            (committee: {
              organization: string;
              title?: string;
              fullText: string;
            }) => ({
              text: committee?.organization
                ?.replace("Subcommittee on", "")
                .replace(", United States Senate", ""),
              fullText: committee?.fullText,
              isChair: committee?.title?.toUpperCase().indexOf("CHAIR") !== -1,
              isSubCommittee:
                committee?.organization
                  ?.toUpperCase()
                  .indexOf("SUBCOMMITTEE") !== -1,
            })
          )
        : [];
    const TAG_PAGE_SIZE = 4;
    const tagPages: Array<Array<TagType>> = Array(
      Math.ceil(tags.length / TAG_PAGE_SIZE)
    )
      .fill("")
      .map((_, index) => index * TAG_PAGE_SIZE)
      .map((begin) => tags?.slice(begin, begin + TAG_PAGE_SIZE));

    if (tags.length === 0) return null;
    const cx = classNames(styles.center, politicianStyles.committees);
    return (
      <section className={cx}>
        <h3 className={styles.subHeader}>Committees</h3>
        <div className={politicianStyles.sectionContent}>
          <Scroller onePageAtATime>
            {tagPages.map((tagPage, index) => (
              <CommitteeTagPage
                tags={tagPage}
                key={`tagPage-${index}`}
                itemId={`tagPage-${index}`}
              />
            ))}
          </Scroller>
        </div>
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
          <div className={politicianStyles.sectionContent}>
            <Scroller>
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
          </div>
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
            party={politician?.party as PoliticalParty}
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

  function ColoredSection(
    props: PropsWithChildren<{
      color: string;
    }>
  ) {
    const styleVars: CSSProperties & {
      "--color-accent": string;
    } = {
      "--color-accent": props.color,
    };

    return (
      <section
        className={classNames(styles.center, styles.borderBottom)}
        style={styleVars}
      >
        {props.children}
      </section>
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
      <ColoredSection color="var(--aqua)">
        <h3 className={styles.gradientHeader}>Endorsements</h3>
        {endorsements?.organizations &&
          endorsements?.organizations?.length > 0 && (
            <div className={politicianStyles.endorsementSection}>
              <h3 className={`${styles.subHeader} ${styles.aqua}`}>
                Organizations
              </h3>
              <div className={politicianStyles.sectionContent}>
                <Scroller showTextButtons>
                  {endorsements?.organizations?.map((organization) => (
                    <OrganizationEndorsement
                      organization={organization}
                      key={organization.slug}
                      itemId={organization.slug}
                    />
                  ))}
                </Scroller>
              </div>
            </div>
          )}
        {endorsements?.politicians && endorsements?.politicians?.length > 0 && (
          <div className={politicianStyles.endorsementSection}>
            <h3 className={`${styles.subHeader} ${styles.aqua}`}>
              Individuals
            </h3>
            <div className={politicianStyles.sectionContent}>
              <Scroller showTextButtons>
                {endorsements?.politicians?.map((politician) => (
                  <PoliticianEndorsement
                    politician={politician as Partial<PoliticianResult>}
                    key={politician.slug}
                    itemId={politician.slug}
                  />
                ))}
              </Scroller>
            </div>
          </div>
        )}
      </ColoredSection>
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
            size={80}
          />
          <div
            className={styles.ratingCircle}
            style={{
              background: `${
                ratingPercent > 80
                  ? "var(--green)"
                  : ratingPercent > 50
                  ? "var(--yellow)"
                  : "var(--red)"
              }`,
            }}
          >
            <span>{ratingPercent}</span>
          </div>
        </div>
        {rating.organization?.name && <h5>{rating.organization?.name}</h5>}
      </div>
    );
  }

  function RatingsSection() {
    if (ratings.length > 1)
      return (
        <ColoredSection color="var(--yellow)">
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
        </ColoredSection>
      );
    return null;
  }

  function BioSection() {
    if (!politician?.biography) return null;
    return (
      <section className={styles.center}>
        <h3 className={styles.gradientHeader}>Bio</h3>
        <p>{politician?.biography}</p>
        {politician?.biographySource && (
          <a
            href={politician?.biographySource as string}
            target="_blank"
            rel="noreferrer"
          >
            <Button variant="secondary" size="medium" label="Source"></Button>
          </a>
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
        <HeaderSection politician={politician as Partial<PoliticianResult>} />
  
        {politician?.currentOffice && <OfficeSection />}

        <ElectionInfoSection
          politician={politician as Partial<PoliticianResult>}
        />
        <div className={politicianStyles.infoCommitteeWrapper}>
          <BasicInfoSection />
          <CommitteesSection />
        </div>
        <SponsoredBillsSection />
        <EndorsementsSection />
        <RatingsSection />
        <BioSection />
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
