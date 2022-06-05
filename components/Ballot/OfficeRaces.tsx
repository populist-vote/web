import { RaceResult } from "generated";
import dynamic from "next/dynamic";
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

  return (
    <>
      <header
        className={`${styles.bold} ${styles.flexBetween} ${styles.inset}`}
      >
        <h2>
          <span>{office?.title} </span>
          {/* If the district is not a number, don't display it */}
          {!isNaN(parseInt(office?.district as string)) && (
            <span>{`District ${office?.district}`}</span>
          )}
        </h2>
        <h3>{office?.state}</h3>
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
