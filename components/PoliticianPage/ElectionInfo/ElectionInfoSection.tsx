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
        src={candidate.assets?.thumbnailImage160 || PERSON_FALLBACK_IMAGE_URL}
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
    slug: query.politicianSlug as string,
  });
  const politicianId = data?.politicianBySlug?.id;
  const upcomingRace = data?.politicianBySlug?.upcomingRace;
  const isPastElection = new Date(upcomingRace?.electionDate) < new Date();

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
        <h4 className={styles.subHeader}>
          {isPastElection ? "Last Election" : "Next Election"}
        </h4>
        <div className={`${styles.box} ${styles.roundedCard} `}>
          <h3>{upcomingRace?.raceType}</h3>
          <h2>{dateString(upcomingRace?.electionDate, true)}</h2>
        </div>
      </div>
      <div>
        <h4 className={styles.subHeader}>
          {isPastElection ? "Ran For" : "Running For"}
        </h4>
        <div className={`${styles.box} ${styles.roundedCard} `}>
          <h3>{upcomingRace?.office.subtitle}</h3>
          <h2>{upcomingRace?.office.name || upcomingRace?.office.title}</h2>
        </div>
      </div>
      <div>
        <h4 className={styles.subHeader}>
          Opponent{opponents.length > 1 && "s"}
        </h4>
        <div className={clsx(styles.boxOpponent, styles.roundedCard)}>
          <div className={styles.opponentContainer}>
            {opponents.length == 0 ? (
              <h3 style={{ justifySelf: "center", width: "100%" }}>None</h3>
            ) : (
              opponents.map((candidate) => {
                return (
                  <Candidate
                    candidate={candidate as PoliticianResult}
                    itemId={candidate.id as string}
                    key={candidate.id}
                  />
                );
              })
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export { ElectionInfoSection, Candidate };
