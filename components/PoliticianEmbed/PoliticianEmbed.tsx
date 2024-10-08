import { Button, LoaderFlag } from "components";
import { PoliticalParty, usePoliticianEmbedByIdQuery } from "generated";
import { useEmbedResizer } from "hooks/useEmbedResizer";
import styles from "./PoliticianEmbed.module.scss";
import { OrganizationAvatar, PartyAvatar } from "components/Avatar/Avatar";
import { dateString } from "utils/dates";
import { WidgetFooter } from "components/WidgetFooter/WidgetFooter";
import {
  FaFacebook,
  FaGlobe,
  FaInstagram,
  FaLinkedin,
  FaTiktok,
  FaTwitter,
  FaYoutube,
  FaInfoCircle,
} from "react-icons/fa";
import { GiWireframeGlobe } from "react-icons/gi";
import Link from "next/link";
import { useState } from "react";

export interface PoliticianEmbedRenderOptions {
  upcomingRace: boolean;
  stats: boolean;
  endorsements: boolean;
  socials: boolean;
}

export function PoliticianEmbed({
  embedId,
  origin,
  renderOptions,
}: {
  embedId: string;
  origin: string;
  renderOptions: PoliticianEmbedRenderOptions;
}) {
  const { data, isLoading, error } = usePoliticianEmbedByIdQuery({
    id: embedId,
  });
  useEmbedResizer({ origin, embedId });

  const politician = data?.embedById.politician;
  const biography = politician?.biography;
  const biographySource = politician?.biographySource;
  const officeTitle = `${politician?.currentOffice?.title} - ${politician?.currentOffice?.subtitleShort}`;
  const upcomingRace = politician?.upcomingRace;
  const isPastElection = new Date(upcomingRace?.electionDate) < new Date();

  if (isLoading) return <LoaderFlag />;
  if (error) return <div>Something went wrong loading this politician.</div>;

  const UpcomingRaceSection = () => (
    <>
      <div className={styles.divider} />
      <section className={styles.upcomingRaceSection}>
        <div>
          <h4>
            {isPastElection ? "Ran For " : "Running For "}
            <span className={styles.electionDate}>
              ({dateString(upcomingRace?.electionDate, true)})
            </span>
          </h4>
          <div className={styles.raceBox}>
            <h4 className={styles.officeSubtitle}>
              {upcomingRace?.office.subtitle}
            </h4>
            <h3 className={styles.officeTitle}>{upcomingRace?.office.name}</h3>
          </div>
        </div>
      </section>
    </>
  );

  const BasicInformation = () => {
    return (
      <>
        <div className={styles.divider} />
        <section className={styles.statsSection}>
          <h4>Biography</h4>
          {!biography ? (
            <span className={styles.emptySectionWithTitle}>NONE</span>
          ) : (
            <>
              <div className={styles.bioContainer}>
                <div className={styles.overflowGradient}>
                  <div className={styles.description}>
                    <p>{biography}</p>
                  </div>
                </div>

                <a
                  href={biographySource as string}
                  target="_blank"
                  rel="noreferrer"
                  style={{ width: "auto" }}
                >
                  <Button
                    variant="text"
                    size="small"
                    label="Source"
                    style={{
                      color: "var(--blue)",
                    }}
                  />
                </a>
              </div>
            </>
          )}
        </section>
      </>
    );
  };

  const EndorsementSection = () => {
    const [isTooltipVisible, setIsTooltipVisible] = useState(false);

    return (
      <>
        <div className={styles.divider} />
        <section className={styles.endorsementSection}>
          <h4>
            Endorsements{" "}
            <div className={styles.infoCircleContainer}>
              <FaInfoCircle
                color="#AAA"
                size={"15px"}
                title="From organizations and publicly elected politicians"
                onClick={() => setIsTooltipVisible(!isTooltipVisible)}
                onMouseEnter={() => setIsTooltipVisible(true)}
                onMouseLeave={() => setIsTooltipVisible(false)}
                className={styles.infoCircle}
              />
            </div>
          </h4>
          {isTooltipVisible && (
            <div className={styles.endorsementsInfoContainer}>
              <div className={styles.endorsementsInfo}>
                <span>From organizations and publicly elected politicians</span>
              </div>
            </div>
          )}
          {[
            ...(politician?.endorsements?.politicians || []),
            ...(politician?.endorsements?.organizations || []),
          ].length == 0 ? (
            <span className={styles.emptySectionWithTitle}>NONE</span>
          ) : (
            <div className={styles.endorsementList}>
              {politician?.endorsements?.organizations.map((endorsement) => (
                <Link
                  href={`/organizations/${endorsement.slug}`}
                  key={endorsement.id}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div
                    key={endorsement.id}
                    className={styles.endorsementContainer}
                  >
                    <OrganizationAvatar
                      alt={endorsement.name as string}
                      src={endorsement.assets?.thumbnailImage160 as string}
                      size={40}
                    />
                    <span className={styles.endorserLabel}>
                      {endorsement.name}
                    </span>
                  </div>
                </Link>
              ))}
              {politician?.endorsements?.politicians.map((endorsement) => (
                <Link
                  href={`/politicians/${endorsement.slug}`}
                  key={endorsement.id}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div
                    key={endorsement.id}
                    className={styles.endorsementContainer}
                  >
                    <PartyAvatar
                      alt={endorsement.fullName as string}
                      src={endorsement.assets?.thumbnailImage160 as string}
                      size={40}
                      party={endorsement.party as PoliticalParty}
                      badgeSize="0.75rem"
                      badgeFontSize="0.5rem"
                      theme="light"
                    />
                    <span className={styles.endorserLabel}>
                      {endorsement.fullName}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </>
    );
  };

  const SocialsSection = () => {
    if (
      !politician?.facebookUrl &&
      !politician?.twitterUrl &&
      !politician?.tiktokUrl &&
      !politician?.instagramUrl &&
      !politician?.youtubeUrl &&
      !politician?.linkedinUrl &&
      !politician?.officialWebsiteUrl &&
      !politician?.campaignWebsiteUrl
    )
      return (
        <>
          <div className={styles.divider} />
          <section className={styles.socials}>
            <span className={styles.emptySection}>NO LINKS</span>
          </section>
        </>
      );
    return (
      <>
        <div className={styles.divider} />
        <section className={styles.socials}>
          {politician?.officialWebsiteUrl && (
            <a
              aria-label={"Official Website"}
              title="Official Website"
              href={
                politician.officialWebsiteUrl?.startsWith("http")
                  ? politician.officialWebsiteUrl
                  : `//${politician.officialWebsiteUrl}`
              }
              target="_blank"
              rel="noopener noreferrer"
            >
              <GiWireframeGlobe />
            </a>
          )}
          {politician?.campaignWebsiteUrl && (
            <a
              aria-label={"Campaign Website"}
              title="Campaign Website"
              href={
                politician.campaignWebsiteUrl?.startsWith("http")
                  ? politician.campaignWebsiteUrl
                  : `//${politician.campaignWebsiteUrl}`
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
              title="Twitter"
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
              title="Facebook"
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
              title="Instagram"
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
          {politician?.tiktokUrl && (
            <a
              aria-label={"TikTok"}
              title="TikTok"
              href={
                politician.tiktokUrl?.startsWith("http")
                  ? politician.tiktokUrl
                  : `//${politician.tiktokUrl}`
              }
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaTiktok />
            </a>
          )}
          {politician?.youtubeUrl && (
            <a
              aria-label={"YouTube"}
              title="YouTube"
              href={
                politician.youtubeUrl?.startsWith("http")
                  ? politician.youtubeUrl
                  : `//${politician.youtubeUrl}`
              }
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaYoutube />
            </a>
          )}
          {politician?.linkedinUrl && (
            <a
              aria-label={"LinkedIn"}
              title="LinkedIn"
              href={
                politician.linkedinUrl?.startsWith("http")
                  ? politician.linkedinUrl
                  : `//${politician.linkedinUrl}`
              }
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaLinkedin />
            </a>
          )}
        </section>
      </>
    );
  };

  return (
    <article className={styles.widgetContainer}>
      <main>
        <section>
          <PartyAvatar
            party={politician?.party as PoliticalParty}
            src={politician?.assets.thumbnailImage400 as string}
            alt={politician?.fullName as string}
            size={80}
            theme="light"
          />
          <h1 className={styles.politicianName}>{politician?.fullName}</h1>
          {politician?.currentOffice && (
            <span className={styles.officeDisplay}>{officeTitle}</span>
          )}
        </section>
        {renderOptions?.upcomingRace && <UpcomingRaceSection />}
        {renderOptions?.endorsements && <EndorsementSection />}
        {renderOptions?.stats && <BasicInformation />}
        {renderOptions?.socials && <SocialsSection />}
      </main>
      <WidgetFooter learnMoreHref={`/politicians/${politician?.slug}`} />
    </article>
  );
}
