import styles from "./ElectionInfoSection.module.scss";
import { PartyAvatar } from "components";
import { PERSON_FALLBACK_IMAGE_URL } from "utils/constants";
import { PoliticalParty, PoliticianResult } from "../../../generated";
import { dateString } from "utils/dates";
import classNames from "classnames";
import dynamic from "next/dynamic";

const Scroller = dynamic(() => import("components/Scroller/Scroller"), {
  ssr: false,
});

function Candidate({
  candidate,
}: {
  candidate: Partial<PoliticianResult>;
  itemId: string;
}) {
  return (
    <div className={styles.avatarContainer} key={candidate.id}>
      <PartyAvatar
        size={60}
        party={candidate.party as PoliticalParty}
        src={candidate.thumbnailImageUrl || PERSON_FALLBACK_IMAGE_URL}
        fallbackSrc={PERSON_FALLBACK_IMAGE_URL}
        alt={candidate?.fullName || ""}
        href={`/politicians/${candidate.slug}`}
      />
      <span className={classNames(styles.link, styles.avatarName)}>
        {candidate.fullName}
      </span>
    </div>
  );
}

function ElectionInfoSection({
  politician,
}: {
  politician: Partial<PoliticianResult>;
}) {
  const sectionCx = classNames(styles.center, styles.borderTop, styles.wrapper);

  const { upcomingRace } = politician;
  const opponents =
    upcomingRace?.candidates?.filter(
      (candidate) => candidate.id != politician.id
    ) || [];
  if (!upcomingRace) return null;

  return (
    <section
      className={sectionCx}
      style={{ borderTop: "1px solid var(--blue-dark)" }}
    >
      <div>
        <h4 className={styles.subHeader}>Next Election</h4>
        <div className={`${styles.box} ${styles.roundedCard} `}>
          <h3>{upcomingRace?.raceType}</h3>
          <h2>{dateString(upcomingRace?.electionDate, true)}</h2>
        </div>
      </div>
      <div>
        <h4 className={styles.subHeader}>Running For</h4>
        <div className={`${styles.box} ${styles.roundedCard} `}>
          <h3>{upcomingRace?.office.subtitle}</h3>
          <h2>{upcomingRace?.office.name || upcomingRace?.office.title}</h2>
        </div>
      </div>
      <div>
        <h4 className={styles.subHeader}>
          Opponent{opponents.length > 1 && "s"}
        </h4>
        <div className={`${styles.roundedCard} ${styles.boxOpponent}`}>
          {opponents.length == 0 ? (
            <h3>None</h3>
          ) : (
            <Scroller hideControls>
              {opponents.map(
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
          )}
        </div>
      </div>
    </section>
  );
}

export { ElectionInfoSection };
