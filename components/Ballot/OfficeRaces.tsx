import { RaceResult, ElectionScope, District } from "generated";
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

  let officeSubheader = "";

  switch (office?.electionScope) {
    case ElectionScope.National:
      break;
    case ElectionScope.State:
      if (office.state) {
        officeSubheader = states[office.state];
      }
      break;
    case ElectionScope.District:
      switch (office?.districtType) {
        case District.UsCongressional:
          if (office.state) {
            officeSubheader = office.state + " District " + office.district;
          }
          break;
        case District.StateSenate:
          officeSubheader = "SD " + office.district;
          break;
        case District.StateHouse:
          officeSubheader = "HD " + office.district;
      }
      break;
    default:
      officeSubheader = "default";
      break;
  }

  // if (office?.electionScope == ElectionScope.State) {
  //   officeSubheader = "Colorado";
  // }

  return (
    <>
      <header
        className={`${styles.bold} ${styles.flexBetween} ${styles.inset} ${styles.raceHeader}`}
      >
        <h3>
          <span>{office?.title}</span>
          {/* If the district is not a number, don't display it */}
          {/* {!isNaN(parseInt(office?.district as string)) && (
            <span className={styles.raceSubheader}>{`District ${office?.district}`}</span>
          )} */}
          {/*  */}
          <span className={styles.raceSubheader}>{officeSubheader}</span>
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
