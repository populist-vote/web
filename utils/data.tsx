import { PoliticalScope, RaceResult } from "generated";

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
    races?.filter(
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

export const splitRaces = (races?: RaceResult[]) => {
  if (!races) return null;

  const federal = groupBy(
    races?.filter(
      (race) => race.office.politicalScope === PoliticalScope.Federal
    ),
    (race) => race.office.id
  );
  const state = groupBy(
    races?.filter(
      (race) =>
        race.office.politicalScope === PoliticalScope.State &&
        !(
          race.office.title.includes("Judge") ||
          race.office.title.includes("Justice")
        )
    ),
    (race) => race.office.id
  );
  const local = groupBy(
    races?.filter(
      (race) =>
        race.office.politicalScope === PoliticalScope.Local &&
        !(
          race.office.title.includes("Judge") ||
          race.office.title.includes("Justice")
        )
    ),
    (race) => race.office.id
  );

  const judicial = groupBy(
    races?.filter(
      (race) =>
        race.office.title.includes("Judge") ||
        race.office.title.includes("Justice")
    ),
    (race) => race.office.id
  );

  return {
    federal,
    state,
    local,
    judicial,
  };
};
