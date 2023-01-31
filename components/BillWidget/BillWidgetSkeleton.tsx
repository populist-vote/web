import styles from "./BillWidget.module.scss";
import { LogoTextDark } from "components/Logo";

function BillWidgetSkeleton() {
  return (
    <div className={styles.billCard} data-test-id="populist-bill-widget">
      <header className={styles.header}></header>
      <section className={styles.cardContent}>
        <h5>Select a bill to get started</h5>
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
