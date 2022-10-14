import { OrganizationAvatar, PartyAvatar } from "components/Avatar/Avatar";
import { ColoredSection } from "components/ColoredSection/ColoredSection";
import { LoaderFlag } from "components/LoaderFlag/LoaderFlag";
import {
  OrganizationResult,
  PoliticalParty,
  PoliticianResult,
  usePoliticianEndorsementsQuery,
} from "generated";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { ORGANIZATION_FALLBACK_IMAGE_URL } from "utils/constants";
import { computeShortOfficeTitle } from "utils/politician";
import styles from "./EndorsementsSection.module.scss";

const Scroller = dynamic(() => import("components/Scroller/Scroller"), {
  ssr: false,
});

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
      <div className={styles.avatarContainer}>
        <OrganizationAvatar
          src={organization.thumbnailImageUrl as string}
          fallbackSrc={ORGANIZATION_FALLBACK_IMAGE_URL}
          alt={organization.name as string}
          size={80}
        />
        <span className={styles.avatarName}>{organization.name}</span>
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
    <Link href={`/politicians/${politician.slug}`} key={politician.id} passHref>
      <div className={styles.avatarContainer}>
        <PartyAvatar
          party={politician?.party as PoliticalParty}
          src={politician?.thumbnailImageUrl as string}
          alt={politician?.fullName as string}
          size={80}
        />
        <span className={styles.avatarName}>{politician.fullName}</span>
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
  const { query } = useRouter();
  const { data, isLoading } = usePoliticianEndorsementsQuery({
    slug: query.slug as string,
  });

  const endorsements = data?.politicianBySlug?.endorsements;
  if (isLoading) return <LoaderFlag />;
  if (
    [
      ...(endorsements?.organizations ?? []),
      ...(endorsements?.politicians ?? []),
    ].length < 1
  )
    return null;
  return (
    <ColoredSection color="var(--aqua)">
      <h2 className={styles.gradientHeader}>Endorsements</h2>
      {endorsements?.organizations && endorsements?.organizations?.length > 0 && (
        <div className={styles.endorsementSection}>
          <h4 className={`${styles.subHeader} ${styles.aqua}`}>
            Organizations
          </h4>
          <div className={styles.sectionContent}>
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
        <div className={styles.endorsementSection}>
          <h4 className={`${styles.subHeader} ${styles.aqua}`}>Individuals</h4>
          <div className={styles.sectionContent}>
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

export { EndorsementsSection };
