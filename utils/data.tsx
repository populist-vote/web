import { IssueTagResult, PoliticalScope, RaceResult, RaceType } from "generated";
import { BsBuildingsFill, BsTrainLightrailFrontFill } from "react-icons/bs";
import { FaBaby, FaCannabis } from "react-icons/fa";
import { GiMissileLauncher, GiPirateGrave, GiPistolGun } from "react-icons/gi";
import { SlEnergy } from "react-icons/sl";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const groupBy = <T, K extends keyof any>(
  list: T[],
  getKey: (item: T) => K
) =>
  list?.reduce(
    (previous, currentItem) => {
      const group = getKey(currentItem);
      if (!previous[group]) previous[group] = [];
      previous[group].push(currentItem);
      return previous;
    },
    {} as Record<K, T[]>
  );

/** Group key: same officeId for regular races; special primaries grouped by office; other special elections get their own group. */
const getRaceGroupKey = (race: RaceResult) => {
  if (!race.isSpecialElection) return race.office.id;
  if (race.raceType === RaceType.Primary) {
    return `${race.office.id}-special-primary`;
  }
  return `${race.office.id}-special-${race.id}`;
};

// Used to pair same office races together (i.e. primaries)
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
    getRaceGroupKey
  );
};

// Split of races into federal, state, local, and judicial
export const splitRaces = (races: RaceResult[]) => {
  const judicial = groupBy(
    races?.filter(
      (race) =>
        race.office.title.includes("Judge") ||
        race.office.title.includes("Justice")
    ),
    getRaceGroupKey
  );

  return {
    federal: filterRaces(races, PoliticalScope.Federal),
    state: filterRaces(races, PoliticalScope.State),
    local: filterRaces(races, PoliticalScope.Local),
    judicial,
  };
};

export const getIssueTagIcon = (issueTag: IssueTagResult) => {
  if (!issueTag) return null;
  switch (issueTag.name) {
    case "Energy":
      return <SlEnergy />;
    case "Property Rights & Real Estate":
      return <BsBuildingsFill />;
    case "Housing":
      return "🏠";
    case "Defense":
      return <GiMissileLauncher />;
    case "Climate Change":
      return "🌦️";
    case "Abortion":
      return <FaBaby />;
    case "Marijuana":
      return <FaCannabis />;
    case "Guns":
      return <GiPistolGun />;
    case "Education":
      return "🎓";
    case "Immigration":
      return "🗽";
    case "Law Enforcement":
      return "👮";
    case "Environment":
      return "🌳";
    case "Taxes":
      return "💰";
    case "LGBTQ+":
      return "🏳️‍🌈";
    case "Death Penalty":
      return <GiPirateGrave />;
    case "Agriculture & Rural Issues":
      return "🌾";
    case "Transportation":
      return <BsTrainLightrailFrontFill />;
    case "Health & Healthcare":
      return "🏥";
    case "Healthcare":
      return "🏥";
    case "Gambling & Gaming":
      return "🃏";
    case "Veterans":
      return "🎖️";
    case "Israel":
      return "🇮🇱";
    case "Iran":
      return "🇮🇷";
    case "Iraq":
      return "🇮🇶";
    case "Russia":
      return "🇷🇺";
    case "China":
      return "🇨🇳";
    default:
      return null;
  }
};
