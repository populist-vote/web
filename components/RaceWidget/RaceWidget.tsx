import { LoaderFlag } from "components/LoaderFlag/LoaderFlag";
import { RaceResult, VoteType, useRaceByIdQuery } from "generated";
import { useEmbedResizer } from "hooks/useEmbedResizer";
import styles from "./RaceWidget.module.scss";
import { Race } from "components/Ballot/Race";
import { Badge } from "components/Badge/Badge";
import { getYear } from "utils/dates";
import { WidgetFooter } from "components/WidgetFooter/WidgetFooter";

interface RaceWidgetRenderOptions {
  theme: "light" | "dark";
}

export function RaceWidget({
  raceId,
  embedId,
  origin,
  renderOptions,
}: {
  raceId: string;
  origin: string;
  embedId?: string;
  renderOptions?: RaceWidgetRenderOptions;
}) {
  const { data, isLoading, error } = useRaceByIdQuery(
    { id: raceId },
    {
      // two minutes
      refetchInterval: 1000 * 60 * 2,
    }
  );
  useEmbedResizer({ origin, embedId });
  const _ = renderOptions;
  const race = data?.raceById as RaceResult;
  const shouldDisplayRaceLabels =
    race?.voteType === VoteType.RankedChoice || (race?.numElect ?? 0) > 1;

  if (isLoading) return <LoaderFlag />;
  if (error) return <div>Something went wrong loading this race.</div>;

  return (
    <article className={styles.widgetContainer}>
      <header className={styles.header}>
        <span className={styles.raceName}>
          <strong>{`${race?.office.name} - ${race?.office.subtitle}`}</strong>
        </span>

        <span className={styles.raceYear}>
          <strong>
            {`${getYear(race.electionDate)} - ${
              race?.isSpecialElection ? " Special " : ""
            }${race.raceType}`}
          </strong>
        </span>
      </header>
      <main>
        {shouldDisplayRaceLabels && (
          <section className={styles.raceLabels}>
            {race?.voteType === VoteType.RankedChoice && (
              <Badge size="small" theme="grey" lightBackground>
                Ranked Choice Vote
              </Badge>
            )}
            {(race?.numElect ?? 0) > 1 && (
              <Badge size="small" theme="grey" lightBackground>
                Elect {race?.numElect}
              </Badge>
            )}
          </section>
        )}
        <Race race={race} itemId={race.id} theme="light" isEmbedded={true} />
        {race?.voteType === VoteType.RankedChoice && (
          <span className={styles.resultsInfoLabel}>
            Percentages are first choice votes.
          </span>
        )}
      </main>
      <WidgetFooter learnMoreHref={"/ballot"} />
    </article>
  );
}
