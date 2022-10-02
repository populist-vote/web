import { RaceSection } from "components";
import { RaceResult } from "generated";
import { splitRaces } from "utils/data";

function ElectionRaces({ races }: { races: RaceResult[] }) {
  const {
    federal: federalRacesGroupedByOffice,
    state: stateRacesGroupedByOffice,
    local: localRacesGroupedByOffice,
    judicial: judicialRacesGroupedByOffice,
  } = splitRaces(races);

  return (
    <>
      {Object.keys(federalRacesGroupedByOffice).length > 0 && (
        <RaceSection
          races={federalRacesGroupedByOffice}
          title="Federal"
          color="aqua"
        />
      )}

      {Object.keys(stateRacesGroupedByOffice).length > 0 && (
        <RaceSection
          races={stateRacesGroupedByOffice}
          title="State"
          color="yellow"
        />
      )}

      {Object.keys(localRacesGroupedByOffice).length > 0 && (
        <RaceSection
          races={localRacesGroupedByOffice}
          title="Local"
          color="salmon"
        />
      )}

      {Object.keys(judicialRacesGroupedByOffice).length > 0 && (
        <RaceSection
          races={judicialRacesGroupedByOffice}
          title="Judicial"
          color="violet"
        />
      )}
    </>
  );
}

export { ElectionRaces };
