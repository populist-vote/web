import clsx from "clsx";
import { RaceResult } from "generated";
import styles from "./Ballot.module.scss";
import { Race } from "./Race";
import { useMemo } from "react";

// Races associated with a single office (to handle primaries)
function OfficeRaces({ races, color }: { races: RaceResult[]; color: string }) {
  const office = races[0]?.office;

  const sortedRaces = useMemo(() => {
    const incumbentIds = office?.incumbents?.map((i) => i.id) || [];

    // Display race that has incumbent first
    const raceSortFn = (a: RaceResult, b: RaceResult) =>
      a.candidates.some((politician) => incumbentIds.includes(politician.id)) &&
      !b.candidates.some((politician) => incumbentIds.includes(politician.id))
        ? -1
        : 1;
    return races.sort(raceSortFn);
  }, [races, office]);

  const headerCx = clsx(
    styles.bold,
    styles.flexBetween,
    styles.inset,
    styles.raceHeader,
    styles[color]
  );

  const cardCx = clsx(styles.roundedCard, styles.flex);

  return (
    <>
      <header className={headerCx}>
        <h3>
          <span>{office?.name || office?.title}</span>
          <span className={styles.raceSubheader}>{office?.subtitle}</span>
        </h3>
      </header>

      <div className={cardCx}>
        {sortedRaces.map((race) => (
          <Race race={race} key={race.id} itemId={race.id} />
        ))}
      </div>
    </>
  );
}

export { OfficeRaces };
