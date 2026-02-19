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

/** Fisher–Yates shuffle; returns a new array so the input is not mutated. */
function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = out[i]!;
    out[i] = out[j]!;
    out[j] = tmp;
  }
  return out;
}

/** Group key: same officeId for regular races; special primaries grouped by office; other special elections get their own group. */
const getRaceGroupKey = (race: RaceResult) => {
  if (!race.isSpecialElection) return race.office.id;
  if (race.raceType === RaceType.Primary) {
    return `${race.office.id}-special-primary`;
  }
  return `${race.office.id}-special-${race.id}`;
};

// Used to pair same office races together (i.e. primaries). When includeJudicial is true, Judge/Justice races are not excluded (so they go into federal/state/local by scope).
// Races within each group are shuffled so e.g. Democratic vs Republican primary order is random. Note: OfficeRaces (and similar) may still sort by incumbent first, so when one race has an incumbent it will appear first; randomization only affects order when incumbent status doesn't decide.
export const filterRaces = (
  races: RaceResult[],
  politicalScope: PoliticalScope,
  includeJudicial = false
) => {
  const grouped = groupBy(
    races?.filter(
      (race) =>
        race.office.politicalScope === politicalScope &&
        (includeJudicial ||
          !(
            race.office.title.includes("Judge") ||
            race.office.title.includes("Justice")
          ))
    ),
    getRaceGroupKey
  );
  const result: Record<string, RaceResult[]> = {};
  for (const key of Object.keys(grouped)) {
    result[key] = shuffle(grouped[key] ?? []);
  }
  return result;
};

// Split of races into federal, state, local, and optionally judicial. When splitOutJudicial is false, judicial races are included in federal/state/local by scope.
export const splitRaces = (
  races: RaceResult[],
  splitOutJudicial = true
) => {
  const includeJudicial = !splitOutJudicial;

  const judicial = splitOutJudicial
    ? groupBy(
        races?.filter(
          (race) =>
            race.office.title.includes("Judge") ||
            race.office.title.includes("Justice")
        ),
        getRaceGroupKey
      )
    : {};

  return {
    federal: filterRaces(races, PoliticalScope.Federal, includeJudicial),
    state: filterRaces(races, PoliticalScope.State, includeJudicial),
    local: filterRaces(races, PoliticalScope.Local, includeJudicial),
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
