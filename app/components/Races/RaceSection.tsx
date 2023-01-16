import { FlagSection, FlagColor, OfficeRaces } from "components";
import { RaceResult } from "graphql-codegen/generated";

interface RaceSectionProps {
  races: Record<string, RaceResult[]>;
  label: string;
  color: FlagColor;
}

function RaceSection({ races, label, color }: RaceSectionProps) {
  return (
    <FlagSection {...{ label, color }}>
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
