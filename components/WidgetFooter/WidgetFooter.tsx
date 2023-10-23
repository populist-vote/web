import { Button } from "components/Button/Button";
import { LogoTextDark } from "components/Logo";
import styles from "./WidgetFooter.module.scss";

export function WidgetFooter({ learnMoreHref }: { learnMoreHref?: string }) {
  return (
    <footer className={styles.footer}>
      <div className={styles.divider} />
      <div className={styles.footerContent}>
        <div className={styles.branding}>
          <span className={styles.poweredBy}>Powered by</span>
          <a href="https://populist.us" target="_blank" rel="noreferrer">
            <LogoTextDark />
          </a>
        </div>
        <a
          href={learnMoreHref || "https://populist.us"}
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
      </div>
    </footer>
  );
}
