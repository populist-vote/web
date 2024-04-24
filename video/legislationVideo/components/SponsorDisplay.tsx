import React from "react";
import { PartyAvatar } from "components";
import styles from "../LegislationVideo.module.scss";
import type { PoliticianResult, PoliticalParty } from "generated";
import { default as clsx } from "clsx";

interface SponsorDisplayProps {
  sponsors: PoliticianResult[];
}

const SponsorDisplay: React.FC<SponsorDisplayProps> = ({ sponsors }) => (
  <div>
    <h1>Sponsors</h1>
    {sponsors.length <= 6 ? (
      <div className={styles.sponsorAvatars}>
        {sponsors.map((sponsor) => (
          <div
            key={sponsor.id}
            className={styles.avatarContainer}
            style={{ marginRight: "3rem", marginLeft: "0" }}
          >
            <PartyAvatar
              theme={"dark"}
              isEndorsement={false}
              iconSize="600px"
              party={sponsor.party as PoliticalParty}
              src={sponsor.assets?.thumbnailImage160 as string}
              alt={`${sponsor.fullName}'s avatar`}
              badgeSize="3rem"
              badgeFontSize="2rem"
              size={240}
            />
            <span className={clsx(styles.link, styles.avatarName)}>
              {sponsor.fullName}
            </span>
          </div>
        ))}
      </div>
    ) : (
      <ul
        className={`${styles.sponsorList} ${sponsors.length > 10 ? styles.twoColumns : ""}`}
      >
        {sponsors.map((sponsor) => (
          <li
            key={sponsor.id}
            style={{
              color:
                sponsor.party?.name === "Democratic-Farmer-Labor"
                  ? "var(--blue-text-light)"
                  : "var(--salmon)",
            }}
          >
            {sponsor.fullName}
          </li>
        ))}
      </ul>
    )}
  </div>
);

export default SponsorDisplay;
