import { RaceSection } from "components";
import { RaceResult } from "graphql-codegen/generated";
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
          label="Federal"
          color="aqua"
        />
      )}

      {Object.keys(stateRacesGroupedByOffice).length > 0 && (
        <RaceSection
          races={stateRacesGroupedByOffice}
          label="State"
          color="yellow"
        />
      )}

      {Object.keys(localRacesGroupedByOffice).length > 0 && (
        <RaceSection
          races={localRacesGroupedByOffice}
          label="Local"
          color="salmon"
        />
      )}

      {Object.keys(judicialRacesGroupedByOffice).length > 0 && (
        <RaceSection
          races={judicialRacesGroupedByOffice}
          label="Judicial"
          color="violet"
        />
      )}
    </>
  );
}

export { ElectionRaces };
