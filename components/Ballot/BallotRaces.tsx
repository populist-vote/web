import { OfficeRaces } from "components/Ballot/OfficeRaces";
import { FlagSection } from "components/FlagSection/FlagSection";
import { PoliticalScope, RaceResult } from "generated";
import { groupBy } from "utils/groupBy";

function ElectionRaces({ races }: { races: RaceResult[] }) {
  const federalRacesGroupedByOffice = groupBy(
    races?.filter(
      (race) => race.office.politicalScope === PoliticalScope.Federal
    ),
    (race) => race.office.id
  );
  const stateRacesGroupedByOffice = groupBy(
    races?.filter(
      (race) => race.office.politicalScope === PoliticalScope.State
    ),
    (race) => race.office.id
  );

  return (
    <>
      {Object.keys(federalRacesGroupedByOffice).length > 0 && (
        <FlagSection title="Federal" color="aqua">
          {Object.entries(federalRacesGroupedByOffice).map(
            ([officeId, races]) => {
              return (
                <OfficeRaces key={officeId} races={races as RaceResult[]} />
              );
            }
          )}
        </FlagSection>
      )}

      {Object.keys(stateRacesGroupedByOffice).length > 0 && (
        <FlagSection title="State" color="yellow">
          {Object.entries(stateRacesGroupedByOffice).map(
            ([officeId, races]) => (
              <OfficeRaces key={officeId} races={races as RaceResult[]} />
            )
          )}
        </FlagSection>
      )}
    </>
  );
}

export { ElectionRaces };
