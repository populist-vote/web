import { Button, LoaderFlag } from "components";
import { Badge } from "components/Badge/Badge";
import { SponsorsBar } from "components/SponsorsBar/SponsorsBar";
import { LogoTextDark } from "components/Logo";
import {
  BillResult,
  BillStatus,
  IssueTagResult,
  PoliticianResult,
  useBillByIdQuery,
} from "generated";
import { useEffect } from "react";
import { getStatusInfo } from "utils/bill";
import { getYear } from "utils/dates";
import { emitData, IResizeHeightMessage } from "utils/messages";
import { splitAtDigitAndJoin, titleCase } from "utils/strings";
import styles from "./BillWidget.module.scss";
import { LastVoteSection } from "./LastVoteSection/LastVoteSection";

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

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      emitData<IResizeHeightMessage>(
        { resizeHeight: entry.contentRect.height, embedId },
        origin
      );
    });

    observer.observe(document.querySelector("body") as HTMLBodyElement);
    return () => observer.disconnect();
  }, [origin, embedId]);

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
      <section className={styles.cardContent}>
        <div>
          <h2 className={styles.title}>{bill.title}</h2>
          {renderOptions?.issueTags && (
            <div className={styles.tags}>
              {bill.issueTags?.map((tag: Partial<IssueTagResult>) => (
                <Badge size="small" theme="grey" key={tag.id} lightBackground>
                  {tag.name}
                </Badge>
              ))}
            </div>
          )}

          {renderOptions?.summary && (
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
          <div className={styles.statusAndVotesContainer}>
            <div className={styles.statusContainer}>
              <h4>Status</h4>
              <div className={styles.status}>
                <div>
                  {titleCase(bill.status?.replaceAll("_", " ") as string)}
                </div>
              </div>
            </div>
            <LastVoteSection votes={bill.legiscanData?.votes || []} />
          </div>
          {renderOptions?.sponsors && bill.sponsors?.length > 0 && (
            <section className={styles.sponsors}>
              <h4>Sponsors</h4>
              <SponsorsBar endorsements={bill.sponsors as PoliticianResult[]} />
            </section>
          )}
        </div>
      </section>
      <footer className={styles.footer}>
        <div className={styles.branding}>
          <span className={styles.poweredBy}>Powered by</span>
          <a href="https://populist.us" target="_blank" rel="noreferrer">
            <LogoTextDark />
          </a>
        </div>
        <a
          href={`https://populist.us/bills/${bill.slug}`}
          target="_blank"
          rel="noreferrer"
        >
          <Button
            variant="secondary"
            size="small"
            label="Learn More"
            theme="grey"
          />
        </a>
      </footer>
    </div>
  );
}

export { BillWidget };
