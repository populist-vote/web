import { IssueTagResult, PoliticalScope, RaceResult } from "generated";
import { BsBuildingsFill, BsTrainLightrailFrontFill } from "react-icons/bs";
import { FaBaby, FaCannabis } from "react-icons/fa";
import { GiMissileLauncher, GiPirateGrave, GiPistolGun } from "react-icons/gi";
import { SlEnergy } from "react-icons/sl";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
