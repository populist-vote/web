import { Button, LoaderFlag } from "components";
import { Badge } from "components/Badge/Badge";
import { SponsorsBar } from "components/SponsorsBar/SponsorsBar";
import {
  BillResult,
  BillStatus,
  IssueTagResult,
  PoliticianResult,
  useBillByIdQuery,
} from "generated";
import { getStatusInfo } from "utils/bill";
import { getYear } from "utils/dates";
import { splitAtDigitAndJoin, titleCase } from "utils/strings";
import styles from "./BillWidget.module.scss";
import { LastVoteSection } from "./LastVoteSection/LastVoteSection";
import { useEmbedResizer } from "hooks/useEmbedResizer";
import { WidgetFooter } from "components/WidgetFooter/WidgetFooter";

interface BillWidgetRenderOptions {
  issueTags: boolean;
  summary: boolean;
  sponsors: boolean;
}

function BillWidget({
  billId,
  embedId,
  origin,
  renderOptions,
}: {
  billId: string;
  embedId: string;
  origin: string;
  renderOptions: BillWidgetRenderOptions;
}) {
  const { data, isLoading, error } = useBillByIdQuery({ id: billId });
  const bill = data?.billById as BillResult;
  const statusInfo = getStatusInfo(bill?.status as BillStatus);

  useEmbedResizer({ origin, embedId });

  const styleVars: React.CSSProperties & {
    [`--status-background`]: string;
    [`--status-border`]: string;
  } = {
    [`--status-background`]: `var(--${statusInfo?.background})`,
    [`--status-border`]: `var(--${statusInfo?.color})`,
  };

  if (isLoading) return <LoaderFlag />;
  if (error) return <div>Something went wrong loading this bill.</div>;

  return (
    <div
      className={styles.billCard}
      style={styleVars}
      data-test-id="populist-bill-widget"
    >
      <header className={styles.header}>
        <strong>
          {bill.state || "U.S."} - {splitAtDigitAndJoin(bill.billNumber)}
        </strong>
        <strong>{getYear(bill.session?.startDate)}</strong>
      </header>
      <main className={styles.cardContent}>
        <section>
          <h2 className={styles.title}>{bill.title}</h2>
        </section>
        {renderOptions?.issueTags && !!bill.issueTags.length && (
          <section className={styles.tags}>
            {bill.issueTags?.map((tag: Partial<IssueTagResult>) => (
              <Badge size="small" theme="grey" key={tag.id} lightBackground>
                {tag.name}
              </Badge>
            ))}
          </section>
        )}

        {renderOptions?.summary && (
          <section className={styles.summaryContainer}>
            {bill.populistSummary && (
              <div className={styles.overflowGradient}>
                <div className={styles.description}>
                  <p>{bill.populistSummary}</p>
                </div>
              </div>
            )}
            <a
              href={bill.fullTextUrl as string}
              target="_blank"
              rel="noreferrer"
              style={{ width: "auto" }}
            >
              <Button
                variant="text"
                size="small"
                label="Full Text"
                style={{
                  color: "var(--blue-dark)",
                }}
              />
            </a>
          </section>
        )}

        <section className={styles.statusAndVotesContainer}>
          <div className={styles.statusContainer}>
            <h4>Status</h4>
            <div className={styles.status}>
              <div>
                {titleCase(bill.status?.replaceAll("_", " ") as string)}
              </div>
            </div>
          </div>
          <LastVoteSection votes={bill.legiscanData?.votes || []} />
        </section>
        {renderOptions?.sponsors && bill.sponsors?.length > 0 && (
          <section className={styles.sponsors}>
            <h4>Sponsors</h4>
            <SponsorsBar endorsements={bill.sponsors as PoliticianResult[]} />
          </section>
        )}
      </main>
      <WidgetFooter learnMoreHref={`https://populist.us/bills/${bill.slug}`} />
    </div>
  );
}

export { BillWidget };
