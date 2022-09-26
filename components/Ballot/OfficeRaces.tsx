import { RaceResult } from "generated";
import dynamic from "next/dynamic";
import styles from "./Ballot.module.scss";
import { Race } from "./Race";

const Scroller = dynamic(() => import("components/Scroller/Scroller"), {
  ssr: false,
});

// Races associated with a single office (to handle primaries)
function OfficeRaces({ races }: { races: RaceResult[] }) {
  const office = races[0]?.office;

  const incumbentId = office?.incumbent?.id;

  // Display race that has incumbent first
  const raceSortFn = (a: RaceResult, b: RaceResult) =>
    a.candidates.some((politician) => politician.id === incumbentId) &&
    !b.candidates.some((politician) => politician.id === incumbentId)
      ? -1
      : 1;

  return (
    <>
      <header
        className={`${styles.bold} ${styles.flexBetween} ${styles.inset} ${styles.raceHeader}`}
      >
        <h3>
          <span>{office?.title}</span>
          <span className={styles.raceSubheader}>{office?.subtitle}</span>
        </h3>
      </header>

      <div className={`${styles.roundedCard}`}>
        <Scroller hideControls>
          {races.sort(raceSortFn).map((race) => (
            <Race
              race={race}
              key={race.id}
              itemId={race.id}
              incumbentId={incumbentId}
            />
          ))}
        </Scroller>
      </div>
    </>
  );
}

export { OfficeRaces };
