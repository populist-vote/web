import { Button, LoaderFlag } from "components";
import { Badge } from "components/Badge/Badge";
import { useBallotMeasureByIdQuery } from "generated";
import { useEmbedResizer } from "hooks/useEmbedResizer";
import { WidgetFooter } from "components/WidgetFooter/WidgetFooter";
import { FaCheckCircle } from "react-icons/fa";
import { RiCloseCircleFill } from "react-icons/ri";
import styles from "./BallotMeasureWidget.module.scss";

export interface BallotMeasureWidgetRenderOptions {
  fullTextLink?: boolean;
  scrollableDescription?: boolean;
}

function BallotMeasureWidget({
  ballotMeasureId,
  embedId,
  origin,
  renderOptions,
}: {
  ballotMeasureId: string;
  embedId: string;
  origin: string;
  renderOptions?: BallotMeasureWidgetRenderOptions;
}) {
  const { data, isLoading, error } = useBallotMeasureByIdQuery({
    id: ballotMeasureId,
  });
  const measure = data?.ballotMeasureById;

  useEmbedResizer({ origin, embedId });

  if (isLoading) return <LoaderFlag />;
  if (error || !measure) {
    return <div>Something went wrong loading this ballot measure.</div>;
  }

  const { yesVotes, noVotes, numPrecinctsReporting, totalPrecincts } = measure;
  const totalVotes = (yesVotes ?? 0) + (noVotes ?? 0);
  const yesPercentage =
    totalVotes > 0
      ? (((yesVotes ?? 0) / totalVotes) * 100).toFixed(1) + "%"
      : "YES";
  const noPercentage =
    totalVotes > 0
      ? (((noVotes ?? 0) / totalVotes) * 100).toFixed(1) + "%"
      : "NO";
  const precinctReportingPercentage =
    (numPrecinctsReporting ?? 0) > 0
      ? (((numPrecinctsReporting ?? 0) / (totalPrecincts ?? 1)) * 100).toFixed(
          0,
        ) + "%"
      : "0";
  const hasResults = totalVotes > 0 && (numPrecinctsReporting ?? 0) > 0;
  const yesShowsPercentage = !Number.isNaN(Number.parseFloat(yesPercentage));
  const noShowsPercentage = !Number.isNaN(Number.parseFloat(noPercentage));

  const showFullTextLink = renderOptions?.fullTextLink !== false;
  const scrollableDescription = renderOptions?.scrollableDescription === true;
  const electionTitle = measure.election?.title;
  const learnMoreHref =
    showFullTextLink && measure.fullTextUrl
      ? measure.fullTextUrl
      : "https://populist.us";

  return (
    <div
      className={styles.billCard}
      data-test-id="populist-ballot-measure-widget"
    >
      <header className={styles.header}>
        <strong>{measure.ballotMeasureCode}</strong>
        {electionTitle && <strong>{electionTitle}</strong>}
      </header>
      <main className={styles.cardContent}>
        <section>
          <h2 className={styles.title}>{measure.title}</h2>
        </section>
        {(measure.description ||
          (showFullTextLink && measure.fullTextUrl)) && (
          <section className={styles.summaryContainer}>
            {measure.description &&
              (scrollableDescription ? (
                <div className={styles.overflowGradient}>
                  <div className={styles.description}>
                    <p>{measure.description}</p>
                  </div>
                </div>
              ) : (
                <div className={styles.fullDescription}>
                  <p>{measure.description}</p>
                </div>
              ))}
            {showFullTextLink && measure.fullTextUrl && (
              <div className={styles.sourceTextLink}>
                <a
                  href={measure.fullTextUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{ width: "auto" }}
                >
                  <Button
                    variant="text"
                    size="small"
                    label="Source Text"
                    style={{
                      color: "var(--blue-dark)",
                    }}
                  />
                </a>
              </div>
            )}
          </section>
        )}
        <div className={styles.voteInfo}>
          <div
            className={styles.votes}
            style={{ justifyContent: hasResults ? "flex-start" : "center" }}
          >
            <Badge
              theme={yesShowsPercentage ? "green-support" : "grey"}
              lightBackground={yesShowsPercentage}
              iconLeft={
                <FaCheckCircle size={24} color="var(--green-support)" />
              }
            >
              {yesPercentage}
            </Badge>
            <Badge
              theme={noShowsPercentage ? "red" : "grey"}
              lightBackground={noShowsPercentage}
              iconLeft={<RiCloseCircleFill size={28} color="var(--red)" />}
            >
              {noPercentage}
            </Badge>
          </div>
          {hasResults && (
            <Badge theme="grey" lightBackground size="small">
              {precinctReportingPercentage} precincts reporting
            </Badge>
          )}
        </div>
      </main>
      <WidgetFooter learnMoreHref={learnMoreHref} />
    </div>
  );
}

export { BallotMeasureWidget };
