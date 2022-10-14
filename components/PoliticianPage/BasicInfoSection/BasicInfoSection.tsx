import classNames from "classnames";
import { Button } from "components/Button/Button";
import { PoliticianResult } from "generated";
import { useMediaQuery } from "hooks/useMediaQuery";
import { FaFacebook, FaGlobe, FaInstagram, FaTwitter } from "react-icons/fa";
import { GiWireframeGlobe } from "react-icons/gi";
import { getYear } from "utils/dates";
import styles from "./BasicInfoSection.module.scss";

function BasicInfoSection({
  politician,
}: {
  politician: Partial<PoliticianResult>;
}) {
  const termStart = getYear(
    politician?.votesmartCandidateBio?.office?.termStart as string
  );
  const termEnd = getYear(
    politician?.votesmartCandidateBio?.office?.termEnd as string
  );
  const isSmallScreen = useMediaQuery("(max-width: 968px)");

  const politicalExperience =
    politician?.votesmartCandidateBio?.candidate?.congMembership?.experience;

  // Votesmart data is very poorly typed, sometimes we get a string here so we need this check
  const committeeTags =
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

  const yearsInPublicOffice = politician?.yearsInPublicOffice;
  const raceWins = politician?.raceWins;
  const raceLosses = politician?.raceLosses;
  const age = politician?.age;

  const cx = classNames(styles.center, styles.basicInfo, {
    [styles.wide as string]: committeeTags.length === 0,
  });

  if (
    !termStart &&
    !termEnd &&
    !yearsInPublicOffice &&
    !age &&
    !raceWins &&
    !raceLosses &&
    !politician?.officialWebsiteUrl &&
    !politician?.campaignWebsiteUrl &&
    !politician?.twitterUrl &&
    !politician?.facebookUrl &&
    !politician?.instagramUrl
  )
    return null;

  return (
    <section className={cx}>
      <h4 className={styles.subHeader}>Basic Info</h4>
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
      {!!yearsInPublicOffice && (
        <p className={styles.flexBetween}>
          <span>Years in Public Office</span>
          <span className={styles.dots} />
          <span>{yearsInPublicOffice}</span>
        </p>
      )}
      {raceWins != null && raceLosses != null && (
        <p className={styles.flexBetween}>
          <span>Elections Won / Lost</span>
          <span className={styles.dots} />
          <span>
            {raceWins} / {raceLosses}
          </span>
        </p>
      )}
      {!!age && (
        <p className={styles.flexBetween}>
          <span>Age</span>
          <span className={styles.dots} />
          <span>{age}</span>
        </p>
      )}
      <div className={styles.links}>
        {politician?.officialWebsiteUrl && (
          <a
            aria-label={"Website"}
            href={
              politician.officialWebsiteUrl?.startsWith("http")
                ? politician.officialWebsiteUrl
                : `//${politician.officialWebsiteUrl}`
            }
            target="_blank"
            rel="noopener noreferrer"
          >
            {isSmallScreen ? (
              <GiWireframeGlobe />
            ) : (
              <Button
                icon={<GiWireframeGlobe />}
                label="Official Website"
                iconPosition="before"
                size="medium"
                variant="secondary"
              />
            )}
          </a>
        )}
        {politician?.campaignWebsiteUrl && (
          <a
            aria-label={"Website"}
            href={
              politician.campaignWebsiteUrl?.startsWith("http")
                ? politician.campaignWebsiteUrl
                : `//${politician.campaignWebsiteUrl}`
            }
            target="_blank"
            rel="noopener noreferrer"
          >
            {isSmallScreen ? (
              <FaGlobe />
            ) : (
              <Button
                icon={<FaGlobe />}
                label="Campaign Website"
                iconPosition="before"
                size="medium"
                variant="secondary"
              />
            )}
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
            {isSmallScreen ? (
              <FaTwitter />
            ) : (
              <Button
                icon={<FaTwitter />}
                label="Twitter"
                iconPosition="before"
                size="medium"
                variant="secondary"
              />
            )}
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
            {isSmallScreen ? (
              <FaFacebook />
            ) : (
              <Button
                icon={<FaFacebook />}
                label="Facebook"
                iconPosition="before"
                size="medium"
                variant="secondary"
              />
            )}
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
            {isSmallScreen ? (
              <FaInstagram />
            ) : (
              <Button
                icon={<FaInstagram />}
                label="Instagram"
                iconPosition="before"
                size="medium"
                variant="secondary"
              />
            )}
          </a>
        )}
      </div>
    </section>
  );
}

export { BasicInfoSection };
