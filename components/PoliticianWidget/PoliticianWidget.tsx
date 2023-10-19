import { LoaderFlag } from "components/LoaderFlag/LoaderFlag";
import { PoliticalParty, usePoliticianEmbedByIdQuery } from "generated";
import { useEmbedResizer } from "hooks/useEmbedResizer";
import styles from "./PoliticianWidget.module.scss";
import { OrganizationAvatar, PartyAvatar } from "components/Avatar/Avatar";
import { dateString, getYear } from "utils/dates";
import { WidgetFooter } from "components/WidgetFooter/WidgetFooter";
import {
  FaFacebook,
  FaGlobe,
  FaInstagram,
  FaLinkedin,
  FaTiktok,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";
import { GiWireframeGlobe } from "react-icons/gi";

export interface PoliticianWidgetRenderOptions {
  upcomingRace: boolean;
  stats: boolean;
  endorsements: boolean;
  socials: boolean;
}

export function PoliticianWidget({
  politicianId,
  embedId,
  origin,
  renderOptions,
}: {
  politicianId: string;
  embedId: string;
  origin: string;
  renderOptions: PoliticianWidgetRenderOptions;
}) {
  const { data, isLoading, error } = usePoliticianEmbedByIdQuery({
    id: politicianId,
  });
  useEmbedResizer({ origin, embedId });

  const politician = data?.politicianById;
  const termStart = getYear(
    politician?.votesmartCandidateBio?.office?.termStart as string
  );
  const termEnd = getYear(
    politician?.votesmartCandidateBio?.office?.termEnd as string
  );
  const yearsInPublicOffice = politician?.yearsInPublicOffice;
  const raceWins = politician?.raceWins;
  const raceLosses = politician?.raceLosses;
  const age = politician?.age;
  const officeTitle = `${politician?.currentOffice?.title} - ${politician?.currentOffice?.subtitleShort}`;
  const upcomingRace = politician?.upcomingRace;
  const isPastElection = new Date(upcomingRace?.electionDate) < new Date();

  if (isLoading) return <LoaderFlag />;
  if (error) return <div>Something went wrong loading this politician.</div>;

  const $upcomingRaceSection = (
    <section className={styles.upcomingRaceSection}>
      <div>
        <h4>{isPastElection ? "Ran For" : "Running For"}</h4>
        <div className={styles.raceBox}>
          <h4 className={styles.officeSubtitle}>
            {upcomingRace?.office.subtitle}
          </h4>
          <h3 className={styles.officeTitle}>{upcomingRace?.office.name}</h3>
        </div>
      </div>
      <div>
        <h4>{`${isPastElection ? "Last" : "Next"} Election`}</h4>
        <div className={styles.raceBox}>
          <h3>{dateString(upcomingRace?.electionDate)}</h3>
        </div>
      </div>
    </section>
  );

  const $statsSection = (
    <section>
      {!!termStart && (
        <div className={styles.dotSpread}>
          <span>Assumed Office</span>
          <span className={styles.dots} />
          <span>{termStart}</span>
        </div>
      )}
      {!!termEnd && (
        <div className={styles.dotSpread}>
          <span>Term Ends</span>
          <span className={styles.dots} />
          <span>{termEnd}</span>
        </div>
      )}
      {!!yearsInPublicOffice && (
        <div className={styles.dotSpread}>
          <span>Years in Public Office</span>
          <span className={styles.dots} />
          <span>{yearsInPublicOffice}</span>
        </div>
      )}
      {(!!raceWins || !!raceLosses) && (
        <div className={styles.dotSpread}>
          <span>Elections Won / Lost</span>
          <span className={styles.dots} />
          <span>
            {raceWins || 0} / {raceLosses || 0}
          </span>
        </div>
      )}
      {!!age && (
        <div className={styles.dotSpread}>
          <span>Age</span>
          <span className={styles.dots} />
          <span>{age}</span>
        </div>
      )}
    </section>
  );

  const $endorsementSection = (
    <section className={styles.endorsementSection}>
      <h4>Endorsements</h4>
      <div className={styles.endorsementList}>
        {politician?.endorsements?.organizations.map((endorsement) => (
          <div key={endorsement.id} className={styles.endorsementContainer}>
            <OrganizationAvatar
              alt={endorsement.name}
              src={endorsement.assets?.thumbnailImage160 as string}
              size={40}
            />
            <span>{endorsement.name}</span>
          </div>
        ))}
        {politician?.endorsements?.politicians.map((endorsement) => (
          <div key={endorsement.id} className={styles.endorsementContainer}>
            <PartyAvatar
              alt={endorsement.fullName}
              src={endorsement.assets?.thumbnailImage160 as string}
              size={40}
              party={endorsement.party as PoliticalParty}
            />
            <span>{endorsement.fullName}</span>
          </div>
        ))}
      </div>
    </section>
  );

  const $socialSection = (
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
  );

  return (
    <article className={styles.widgetContainer}>
      <main>
        <section>
          <PartyAvatar
            party={politician?.party as PoliticalParty}
            src={politician?.assets.thumbnailImage400 as string}
            alt={politician?.fullName as string}
            size={80}
          />
          <h1>{politician?.fullName}</h1>
          {politician?.currentOffice && (
            <span className={styles.officeDisplay}>{officeTitle}</span>
          )}
        </section>
        {renderOptions?.upcomingRace && (
          <>
            <div className={styles.divider} />
            {$upcomingRaceSection}
          </>
        )}
        {renderOptions?.stats && (
          <>
            <div className={styles.divider} />
            {$statsSection}
          </>
        )}
        {renderOptions?.endorsements && (
          <>
            <div className={styles.divider} />
            {$endorsementSection}
          </>
        )}
        {renderOptions?.socials && (
          <>
            <div className={styles.divider} />
            {$socialSection}
          </>
        )}
      </main>
      <WidgetFooter learnMoreHref={`/politicians/${politician?.slug}`} />
    </article>
  );
}
