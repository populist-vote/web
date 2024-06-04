import React from "react";
import { PartyAvatar } from "../../../../components";
import styles from "./SponsorScene.module.scss";
import type { PoliticianResult, PoliticalParty } from "generated";
import { Animated, Fade, Move } from "remotion-animated";
import { FaCircle } from "react-icons/fa";

interface SponsorSceneProps {
  sponsors: PoliticianResult[];
}

const SponsorScene: React.FC<SponsorSceneProps> = ({ sponsors }) => {
  const avatarStaggerAmount = 10; // Stagger each avatar animation (in frames)
  const listStaggerAmount = 2; // Stagger each list item animation (in frames)

  // Calculate the total delay needed for the first group of avatar animations
  const initialGroupDelay =
    sponsors.length >= 4 ? (sponsors.length - 1) * avatarStaggerAmount : 0;

  return (
    <div className={styles.SponsorScene}>
      <h1>Sponsors</h1>
      {sponsors.length <= 3 ? (
        <div className={styles.sponsorAvatars}>
          {sponsors.map((sponsor, index) => (
            <div key={sponsor.id} className={styles.avatarContainer}>
              <Animated
                animations={[
                  Move({ y: 0, initialY: 80 }),
                  Fade({ to: 1, initial: 0 }),
                ]}
                delay={20 + index * avatarStaggerAmount}
                style={{ opacity: 0 }}
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
                  isRemotionImage
                />
                <div className={styles.avatarName}>{sponsor.fullName}</div>
              </Animated>
            </div>
          ))}
        </div>
      ) : sponsors.length >= 4 && sponsors.length <= 6 ? (
        <>
          <div className={styles.sponsorAvatars}>
            {sponsors.slice(0, 3).map((sponsor, index) => (
              <div key={sponsor.id} className={styles.avatarContainer}>
                <Animated
                  animations={[
                    Move({ y: 0, initialY: 80 }),
                    Fade({ to: 1, initial: 0 }),
                  ]}
                  delay={20 + index * avatarStaggerAmount}
                  style={{ opacity: 0 }}
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
                  <div className={styles.avatarName}>{sponsor.fullName}</div>
                </Animated>
              </div>
            ))}
          </div>
          <div className={styles.sponsorAvatars}>
            {sponsors.slice(3).map((sponsor, index) => (
              <div key={sponsor.id} className={styles.avatarContainer}>
                <Animated
                  animations={[
                    Move({ y: 0, initialY: 80 }),
                    Fade({ to: 1, initial: 0 }),
                  ]}
                  delay={initialGroupDelay + 20 + index * avatarStaggerAmount} // Delay these animations to start after the initial group finishes
                  style={{ opacity: 0 }}
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
                  <div className={styles.avatarName}>{sponsor.fullName}</div>
                </Animated>
              </div>
            ))}
          </div>
        </>
      ) : (
        <ul
          className={`${styles.sponsorList} ${
            sponsors.length > 10 ? styles.twoColumns : ""
          }`}
        >
          {sponsors.map((sponsor, index) => (
            <li
              key={sponsor.id}
              style={{
                color:
                  sponsor.party?.name === "Democratic-Farmer-Labor"
                    ? "var(--blue-text-light)"
                    : "var(--salmon)",
              }}
            >
              <Animated
                animations={[
                  Move({ x: 0, initialX: -30 }),
                  Fade({ to: 1, initial: 0 }),
                ]}
                delay={20 + index * listStaggerAmount}
                style={{ opacity: 0 }}
              >
                <div>
                  <FaCircle
                    size={32}
                    style={{
                      color:
                        sponsor.party?.name === "Democratic-Farmer-Labor"
                          ? "var(--blue)"
                          : "var(--red)",
                    }}
                  />
                  {sponsor.fullName}
                </div>
              </Animated>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SponsorScene;
