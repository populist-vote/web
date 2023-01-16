import { PoliticalScope, RaceResult } from "graphql-codegen/generated";

export const groupBy = <T, K extends keyof any>(
  list: T[],
  getKey: (item: T) => K
) =>
  list.reduce((previous, currentItem) => {
    const group = getKey(currentItem);
    if (!previous[group]) previous[group] = [];
    previous[group].push(currentItem);
    return previous;
  }, {} as Record<K, T[]>);

export const filterRaces = (
  races: RaceResult[],
  politicalScope: PoliticalScope
) => {
  return groupBy(
    races.filter(
      (race) =>
        race.office.politicalScope === politicalScope &&
        !(
          race.office.title.includes("Judge") ||
          race.office.title.includes("Justice")
        )
    ),
    (race) => race.office.id
  );
};

export const splitRaces = (races: RaceResult[]) => {
  const judicial = groupBy(
    races.filter(
      (race) =>
        race.office.title.includes("Judge") ||
        race.office.title.includes("Justice")
    ),
    (race) => race.office.id
  );

  return {
    federal: filterRaces(races, PoliticalScope.Federal),
    state: filterRaces(races, PoliticalScope.State),
    local: filterRaces(races, PoliticalScope.Local),
    judicial,
  };
};
