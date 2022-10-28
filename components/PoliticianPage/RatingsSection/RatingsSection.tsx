import { OrganizationAvatar } from "components/Avatar/Avatar";
import { ColoredSection } from "components/ColoredSection/ColoredSection";
import { LoaderFlag } from "components/LoaderFlag/LoaderFlag";
import {
  RatingResult,
  RatingResultEdge,
  usePoliticianRatingsQuery,
} from "generated";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { ORGANIZATION_FALLBACK_IMAGE_URL } from "utils/constants";
import styles from "./RatingsSection.module.scss";

const Scroller = dynamic(() => import("components/Scroller/Scroller"), {
  ssr: false,
});

function RatingsItem({ rating }: { rating: RatingResult; itemId: string }) {
  const ratingPercent = parseInt(rating.vsRating.rating);

  return (
    <div className={styles.ratingContainer} key={rating?.vsRating.ratingId}>
      <div className={styles.circlesContainer}>
        <OrganizationAvatar
          src={
            (rating.organization?.assets?.thumbnailImage160 ||
              rating.organization?.thumbnailImageUrl) as string
          }
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
      {rating.organization?.name && (
        <span className={styles.avatarName}>{rating.organization?.name}</span>
      )}
    </div>
  );
}

function RatingsSection() {
  const { query } = useRouter();
  const { data, isLoading } = usePoliticianRatingsQuery({
    slug: query.slug as string,
  });
  if (isLoading) return <LoaderFlag />;
  const ratings = (data?.politicianBySlug?.ratings.edges ||
    []) as RatingResultEdge[];
  if (ratings.length < 1) return null;
  return (
    <ColoredSection color="var(--yellow)">
      <h2 className={styles.gradientHeader}>Ratings</h2>
      <div className={styles.sectionContent}>
        <Scroller showTextButtons>
          {ratings.map((edge: RatingResultEdge, i) => (
            <RatingsItem
              rating={edge.node}
              key={`${edge.node.vsRating.ratingId}-${i}`}
              itemId={`${edge.node.vsRating.ratingId}-${i}`}
            />
          ))}
        </Scroller>
      </div>
    </ColoredSection>
  );
}

export { RatingsSection };
