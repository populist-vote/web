import styles from "./ElectionInfoSection.module.scss";
import { PartyAvatar, LoaderFlag } from "components";
import { PERSON_FALLBACK_IMAGE_URL } from "utils/constants";
import {
  PoliticalParty,
  PoliticianResult,
  usePoliticianElectionInfoQuery,
} from "../../../generated";
import { dateString } from "utils/dates";
import clsx from "clsx";
import { useRouter } from "next/router";

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
        src={
          candidate.thumbnailImageUrl ||
          candidate.assets?.thumbnailImage160 ||
          PERSON_FALLBACK_IMAGE_URL
        }
        fallbackSrc={PERSON_FALLBACK_IMAGE_URL}
        alt={candidate?.fullName || ""}
        href={`/politicians/${candidate.slug}`}
      />
      <span className={clsx(styles.link, styles.avatarName)}>
        {candidate.fullName}
      </span>
    </div>
  );
}

function ElectionInfoSection() {
  const { query } = useRouter();
  const sectionCx = clsx(styles.center, styles.borderTop, styles.wrapper);
  const { data, isLoading } = usePoliticianElectionInfoQuery({
    slug: query.slug as string,
  });
  const politicianId = data?.politicianBySlug?.id;
  const upcomingRace = data?.politicianBySlug?.upcomingRace;

  if (isLoading) return <LoaderFlag />;

  const opponents =
    upcomingRace?.candidates?.filter(
      (candidate) => candidate.id != politicianId
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
            opponents.map(
              (candidate: Partial<PoliticianResult> & { id: string }) => {
                return (
                  <Candidate
                    candidate={candidate}
                    itemId={candidate.id}
                    key={candidate.id}
                  />
                );
              }
            )
          )}
        </div>
      </div>
    </section>
  );
}

export { ElectionInfoSection, Candidate };
