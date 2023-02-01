import styles from "./BillWidget.module.scss";
import { LogoTextDark } from "components/Logo";
import { Button } from "components/Button/Button";
import Link from "next/link";

function BillWidgetSkeleton({
  embedId,
  slug,
}: {
  embedId: string;
  slug: string;
}) {
  return (
    <div className={styles.billCard} data-test-id="populist-bill-widget">
      <header className={styles.header}></header>
      <section className={styles.cardContent}>
        <div>
          <h5>Select a bill to get started</h5>
          <Link
            href={`/dashboard/${slug}/embeds/legislation?embedId=${embedId}`}
          >
            <Button
              variant="primary"
              size="medium"
              theme="yellow"
              label="Select Legislation"
            />
          </Link>
        </div>
      </section>
      <footer className={styles.footer}>
        <div />
        <div className={styles.branding}>
          <span className={styles.poweredBy}>Powered by</span>
          <LogoTextDark />
        </div>
      </footer>
    </div>
  );
}

export { BillWidgetSkeleton };
