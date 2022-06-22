import { RaceResult } from "generated";
import dynamic from "next/dynamic";
import states from "utils/states";
import styles from "../Layout/Layout.module.scss";
import Race from "./Race";

const Scroller = dynamic(() => import("components/Scroller/Scroller"), {
  ssr: false,
});

// Races associated with a single office (to handle primaries)
export function OfficeRaces({ races }: { races: RaceResult[] }) {
  const office = races[0]?.office;

  const incumbentId = office?.incumbent?.id;

  // Display race that has incumbent first
  const raceSortFn = (a: RaceResult, b: RaceResult) =>
    a.candidates.some((politician) => politician.id === incumbentId) &&
    !b.candidates.some((politician) => politician.id === incumbentId)
      ? -1
      : 1;

  const hasDistrict = !isNaN(parseInt(office?.district as string));

  return (
    <>
      <header
        className={`${styles.bold} ${styles.flexBetween} ${styles.inset} ${styles.raceHeader}`}
      >
        <h3>
          <span>{office?.title}</span>
          {/* If the district is not a number, don't display it */}
          {hasDistrict ? (
            <span
              className={styles.raceSubheader}
            >{`District ${office?.district}`}</span>
          ) : office?.state ? (
            <span className={styles.raceSubheader}>
              {states[office?.state]}
            </span>
          ) : null}
        </h3>
      </header>

      <div className={`${styles.roundedCard}`}>
        <Scroller>
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
