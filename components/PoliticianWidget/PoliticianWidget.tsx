import { LoaderFlag } from "components/LoaderFlag/LoaderFlag";
import { PoliticalParty, usePoliticianEmbedByIdQuery } from "generated";
import { useEmbedResizer } from "hooks/useEmbedResizer";
import styles from "./PoliticianWidget.module.scss";
import { PartyAvatar } from "components/Avatar/Avatar";
import { getYear } from "utils/dates";
import { WidgetFooter } from "components/WidgetFooter/WidgetFooter";

interface PoliticianWidgetRenderOptions {
  bio: boolean;
}

export function PoliticianWidget({
  politicianId,
  embedId,
  origin,
  renderOptions,
}: {
  politicianId: string;
  embedId: string;
  origin: string;
  renderOptions: PoliticianWidgetRenderOptions;
}) {
  const { data, isLoading, error } = usePoliticianEmbedByIdQuery({
    id: politicianId,
  });
  useEmbedResizer({ origin, embedId });

  const _ = renderOptions;

  const politician = data?.politicianById;
  const termStart = getYear(
    politician?.votesmartCandidateBio?.office?.termStart as string
  );
  const termEnd = getYear(
    politician?.votesmartCandidateBio?.office?.termEnd as string
  );
  const yearsInPublicOffice = politician?.yearsInPublicOffice;
  const raceWins = politician?.raceWins;
  const raceLosses = politician?.raceLosses;
  const age = politician?.age;

  if (isLoading) return <LoaderFlag />;
  if (error) return <div>Something went wrong loading this politician.</div>;

  return (
    <article className={styles.widgetContainer}>
      <main>
        <section>
          <PartyAvatar
            party={politician?.party as PoliticalParty}
            src={politician?.thumbnailImageUrl as string}
            alt={politician?.fullName as string}
            size={80}
          />
          <h1>{politician?.fullName}</h1>
        </section>
        <div className={styles.divider} />
        <section>
          {!!termStart && (
            <div className={styles.dotSpread}>
              <span>Assumed Office</span>
              <span className={styles.dots} />
              <span>{termStart}</span>
            </div>
          )}
          {!!termEnd && (
            <div className={styles.dotSpread}>
              <span>Term Ends</span>
              <span className={styles.dots} />
              <span>{termEnd}</span>
            </div>
          )}
          {!!yearsInPublicOffice && (
            <div className={styles.dotSpread}>
              <span>Years in Public Office</span>
              <span className={styles.dots} />
              <span>{yearsInPublicOffice}</span>
            </div>
          )}
          {raceWins != null && raceLosses != null && (
            <div className={styles.dotSpread}>
              <span>Elections Won / Lost</span>
              <span className={styles.dots} />
              <span>
                {raceWins} / {raceLosses}
              </span>
            </div>
          )}
          {!!age && (
            <div className={styles.dotSpread}>
              <span>Age</span>
              <span className={styles.dots} />
              <span>{age}</span>
            </div>
          )}
        </section>
      </main>
      <WidgetFooter />
    </article>
  );
}
