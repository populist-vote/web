import { useEmbedResizer } from "hooks/useEmbedResizer";
import styles from "./CandidateGuideEmbed.module.scss";
import { WidgetFooter } from "components/WidgetFooter/WidgetFooter";
import Divider from "components/Divider/Divider";
import { Badge } from "components/Badge/Badge";
import {
  State,
  useCandidateGuideByIdQuery,
  useEmbedByIdQuery,
} from "generated";
import { LoaderFlag } from "components/LoaderFlag/LoaderFlag";
import states from "utils/states";
import { getYear } from "utils/dates";

export function CandidateGuideEmbed({
  embedId,
  candidateGuideId,
  origin,
}: {
  embedId: string;
  candidateGuideId: string;
  origin: string;
}) {
  const { data, isLoading } = useCandidateGuideByIdQuery({
    id: candidateGuideId,
  });

  const { data: embedData } = useEmbedByIdQuery({
    id: embedId,
  });

  const race = embedData?.embedById.race;
  const election = race.election;

  useEmbedResizer({ origin, embedId });
  if (isLoading) return <LoaderFlag />;

  return (
    <div className={styles.widgetContainer} style={{ maxWidth: "900px" }}>
      <header className={styles.header}>
        <strong>Candidate Guide</strong>
        <strong>
          {getYear(election.electionDate)} - {election.name}
        </strong>
      </header>
      <main>
        <pre>{JSON.stringify(embedData, null, 2)}</pre>
        <div className={styles.title}>
          <div className={styles.flexEvenly}>
            <h2>{race?.office.name}</h2>
            <Divider vertical color="var(--grey-dark)" />
            <h2>{states[race?.state as State]}</h2>
          </div>
          <div>
            <Badge theme="grey" label="2024" />
          </div>
        </div>
      </main>
      <WidgetFooter />
    </div>
  );
}
