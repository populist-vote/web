import { FlagSection, FlagColor, OfficeRaces } from "components";
import { RaceResult } from "generated";

interface RaceSectionProps {
  races: Record<string, RaceResult[]>;
  title: string;
  color: FlagColor;
}

function RaceSection({ races, title, color }: RaceSectionProps) {
  return (
    <FlagSection {...{ title, color }}>
      {Object.entries(races).map(([officeId, races]) => (
        <OfficeRaces
          key={officeId}
          races={races as RaceResult[]}
          color={color}
        />
      ))}
    </FlagSection>
  );
}

export { RaceSection };
