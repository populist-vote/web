import clsx from "clsx";
import { RaceResult } from "generated";
import styles from "./Ballot.module.scss";
import { Race } from "./Race";

// Races associated with a single office (to handle primaries)
function OfficeRaces({ races, color }: { races: RaceResult[]; color: string }) {
  const office = races[0]?.office;

  const incumbentId = office?.incumbent?.id;

  // Display race that has incumbent first
  const raceSortFn = (a: RaceResult, b: RaceResult) =>
    a.candidates.some((politician) => politician.id === incumbentId) &&
    !b.candidates.some((politician) => politician.id === incumbentId)
      ? -1
      : 1;

  const headerCx = clsx(
    styles.bold,
    styles.flexBetween,
    styles.inset,
    styles.raceHeader,
    styles[color]
  );

  return (
    <>
      <header className={headerCx}>
        <h3>
          <span>{office?.name || office?.title}</span>
          <span className={styles.raceSubheader}>{office?.subtitle}</span>
        </h3>
      </header>

      <div className={styles.roundedCard}>
        {races.sort(raceSortFn).map((race) => (
          <Race
            race={race}
            key={race.id}
            itemId={race.id}
            incumbentId={incumbentId}
          />
        ))}
      </div>
    </>
  );
}

export { OfficeRaces };
