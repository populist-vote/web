import styles from "styles/page.module.scss";

import electionStyles from "./ElectionInfo.module.scss";

import { PartyAvatar, Scroller } from "components";

import layoutStyles from "../../components/Layout/Layout.module.scss";

import Link from "next/link";

import states from "utils/states";

import { PERSON_FALLBACK_IMAGE_URL } from "utils/constants";

import { PoliticalParty, PoliticianResult } from "../../generated";

import { dateString } from "utils/dates";

function Candidate({
  candidate,
}: {
  candidate: Partial<PoliticianResult>;
  itemId: string;
}) {
  return (
    <Link href={`/politicians/${candidate.slug}`} key={candidate.id} passHref>
      <div className={layoutStyles.avatarContainer}>
        <PartyAvatar
          size={60}
          party={candidate.party || ("UNKNOWN" as PoliticalParty)}
          src={candidate.thumbnailImageUrl || PERSON_FALLBACK_IMAGE_URL}
          fallbackSrc={PERSON_FALLBACK_IMAGE_URL}
          alt={candidate?.fullName || ""}
        />
        <h4>{candidate.fullName}</h4>
      </div>
    </Link>
  );
}

function ElectionInfoSection({
  politician,
}: {
  politician: Partial<PoliticianResult>;
}) {
  const { upcomingRace } = politician;
  const opponents =
    upcomingRace?.candidates.filter(
      (candidate) => candidate.id != politician.id
    ) || [];
  if (!upcomingRace) return null;

  return (
    <section className={`${styles.center} ${electionStyles.wrapper}`}>
      <div>
        <h3 className={styles.subHeader}>Next Election</h3>
        <div className={`${styles.roundedCard} ${electionStyles.box}`}>
          <h2>{upcomingRace?.title}</h2>
          <h1>{dateString(upcomingRace?.electionDate)}</h1>
        </div>
      </div>
      <div>
        <h3 className={styles.subHeader}>Running For</h3>
        <div className={`${styles.roundedCard} ${electionStyles.box}`}>
          {upcomingRace?.state && <h2>{states[upcomingRace.state]}</h2>}
          <h1>{upcomingRace?.office.title}</h1>
        </div>
      </div>
      <div>
        <h3 className={styles.subHeader}>
          Opponent{opponents.length > 1 && "s"}
        </h3>
        <div className={`${styles.roundedCard} ${electionStyles.box}`}>
          {opponents.length == 0 ? (
            "N/A"
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
