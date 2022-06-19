import styles from "styles/page.module.scss";
import electionStyles from "./ElectionInfo.module.scss";
import { PartyAvatar, Scroller } from "components";
import layoutStyles from "../../components/Layout/Layout.module.scss";
import states from "utils/states";
import { PERSON_FALLBACK_IMAGE_URL } from "utils/constants";
import { PoliticalParty, PoliticianResult } from "../../generated";
import { dateString } from "utils/dates";
import classNames from "classnames";

function Candidate({
  candidate,
}: {
  candidate: Partial<PoliticianResult>;
  itemId: string;
}) {
  return (
    <div className={layoutStyles.avatarContainer} key={candidate.id}>
      <PartyAvatar
        size={60}
        party={candidate.party as PoliticalParty}
        src={candidate.thumbnailImageUrl || PERSON_FALLBACK_IMAGE_URL}
        fallbackSrc={PERSON_FALLBACK_IMAGE_URL}
        alt={candidate?.fullName || ""}
        href={`/politicians/${candidate.slug}`}
      />
      <span className={classNames(layoutStyles.link,styles.avatarName)}>{candidate.fullName}</span>
    </div>
  );
}

function ElectionInfoSection({
  politician,
}: {
  politician: Partial<PoliticianResult>;
}) {
  const { upcomingRace } = politician;
  const opponents =
    upcomingRace?.candidates?.filter(
      (candidate) => candidate.id != politician.id
    ) || [];
  if (!upcomingRace) return null;

  const sectionCx = classNames(
    styles.center,
    styles.borderBottom,
    electionStyles.wrapper
  );

  return (
    <section className={sectionCx}>
      <div>
        <h4 className={styles.subHeader}>Next Election</h4>
        <div className={`${styles.roundedCard} ${electionStyles.box}`}>
          <h3>{upcomingRace?.title}</h3>
          <h2>{dateString(upcomingRace?.electionDate, true)}</h2>
        </div>
      </div>
      <div>
        <h4 className={styles.subHeader}>Running For</h4>
        <div className={`${styles.roundedCard} ${electionStyles.box}`}>
          {upcomingRace?.state && <h3>{states[upcomingRace.state]}</h3>}
          <h2>{upcomingRace?.office.title}</h2>
        </div>
      </div>
      <div>
        <h4 className={styles.subHeader}>
          Opponent{opponents.length > 1 && "s"}
        </h4>
        <div className={`${styles.roundedCard} ${electionStyles.boxOpponent}`}>
          {opponents.length == 0 ? (
            <h3>None</h3>
          ) : (
            <Scroller>
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

export default ElectionInfoSection;
