import { LoaderFlag } from "components/LoaderFlag/LoaderFlag";
import { RaceResult, useRaceByIdQuery } from "generated";
import { useEmbedResizer } from "hooks/useEmbedResizer";
import styles from "./RaceWidget.module.scss";
import { Race } from "components/Ballot/Race";
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
  embedId: string;
  origin: string;
  renderOptions: RaceWidgetRenderOptions;
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

  if (isLoading) return <LoaderFlag />;
  if (error) return <div>Something went wrong loading this race.</div>;

  return (
    <article className={styles.widgetContainer}>
      <header className={styles.header}>
        <strong>
          <span className={styles.raceName}>
            {`${race?.office.name} - ${race?.office.subtitle}`}
          </span>
        </strong>
        <strong>
          <span className={styles.raceYear}>
            {`${getYear(race.electionDate)} - ${race.raceType}`}
          </span>
        </strong>
      </header>
      <main>
        <Race race={race} itemId={race.id} theme="light" isEmbedded={true} />
      </main>
      <WidgetFooter learnMoreHref={"/ballot"} />
    </article>
  );
}
