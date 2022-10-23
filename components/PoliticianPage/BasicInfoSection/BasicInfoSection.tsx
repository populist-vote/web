import clsx from "clsx";
import { Button } from "components/Button/Button";
import { PoliticianResult } from "generated";
import { useMediaQuery } from "hooks/useMediaQuery";
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
import { getYear } from "utils/dates";
import styles from "./BasicInfoSection.module.scss";

function BasicInfoSection({
  basicInfo,
}: {
  basicInfo: Partial<PoliticianResult>;
}) {
  const termStart = getYear(
    basicInfo?.votesmartCandidateBio?.office?.termStart as string
  );
  const termEnd = getYear(
    basicInfo?.votesmartCandidateBio?.office?.termEnd as string
  );
  const isSmallScreen = useMediaQuery("(max-width: 968px)");

  const politicalExperience =
    basicInfo?.votesmartCandidateBio?.candidate?.congMembership?.experience;

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

  const yearsInPublicOffice = basicInfo?.yearsInPublicOffice;
  const raceWins = basicInfo?.raceWins;
  const raceLosses = basicInfo?.raceLosses;
  const age = basicInfo?.age;

  const cx = clsx(styles.center, styles.basicInfo, {
    [styles.wide as string]: committeeTags.length === 0,
  });

  if (
    !termStart &&
    !termEnd &&
    !yearsInPublicOffice &&
    !age &&
    !raceWins &&
    !raceLosses &&
    !basicInfo?.officialWebsiteUrl &&
    !basicInfo?.campaignWebsiteUrl &&
    !basicInfo?.twitterUrl &&
    !basicInfo?.facebookUrl &&
    !basicInfo?.instagramUrl
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
        {basicInfo?.officialWebsiteUrl && (
          <a
            aria-label={"Website"}
            href={
              basicInfo.officialWebsiteUrl?.startsWith("http")
                ? basicInfo.officialWebsiteUrl
                : `//${basicInfo.officialWebsiteUrl}`
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
        {basicInfo?.campaignWebsiteUrl && (
          <a
            aria-label={"Website"}
            href={
              basicInfo.campaignWebsiteUrl?.startsWith("http")
                ? basicInfo.campaignWebsiteUrl
                : `//${basicInfo.campaignWebsiteUrl}`
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
        {basicInfo?.twitterUrl && (
          <a
            aria-label={"Twitter"}
            href={
              basicInfo.twitterUrl?.startsWith("http")
                ? basicInfo.twitterUrl
                : `//${basicInfo.twitterUrl}`
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
        {basicInfo?.facebookUrl && (
          <a
            aria-label={"Facebook"}
            href={
              basicInfo.facebookUrl?.startsWith("http")
                ? basicInfo.facebookUrl
                : `//${basicInfo.facebookUrl}`
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
        {basicInfo?.instagramUrl && (
          <a
            aria-label={"Instagram"}
            href={
              basicInfo.instagramUrl?.startsWith("http")
                ? basicInfo.instagramUrl
                : `//${basicInfo.instagramUrl}`
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
        {basicInfo.tiktokUrl && (
          <a
            aria-label={"TikTok"}
            href={
              basicInfo.tiktokUrl?.startsWith("http")
                ? basicInfo.tiktokUrl
                : `//${basicInfo.tiktokUrl}`
            }
            target="_blank"
            rel="noopener noreferrer"
          >
            {isSmallScreen ? (
              <FaTiktok />
            ) : (
              <Button
                icon={<FaTiktok />}
                label="TikTok"
                iconPosition="before"
                size="medium"
                variant="secondary"
              />
            )}
          </a>
        )}
        {basicInfo.youtubeUrl && (
          <a
            aria-label={"YouTube"}
            href={
              basicInfo.youtubeUrl?.startsWith("http")
                ? basicInfo.youtubeUrl
                : `//${basicInfo.youtubeUrl}`
            }
            target="_blank"
            rel="noopener noreferrer"
          >
            {isSmallScreen ? (
              <FaYoutube />
            ) : (
              <Button
                icon={<FaYoutube />}
                label="YouTube"
                iconPosition="before"
                size="medium"
                variant="secondary"
              />
            )}
          </a>
        )}
        {basicInfo.linkedinUrl && (
          <a
            aria-label={"LinkedIn"}
            href={
              basicInfo.linkedinUrl?.startsWith("http")
                ? basicInfo.linkedinUrl
                : `//${basicInfo.linkedinUrl}`
            }
            target="_blank"
            rel="noopener noreferrer"
          >
            {isSmallScreen ? (
              <FaLinkedin />
            ) : (
              <Button
                icon={<FaLinkedin />}
                label="YouTube"
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
