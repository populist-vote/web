import { Button } from "components/Button/Button";
import { LogoTextDark } from "components/Logo";
import styles from "./WidgetFooter.module.scss";
import { useTranslation } from "next-i18next";

export function WidgetFooter({ learnMoreHref }: { learnMoreHref?: string }) {
  const { t } = useTranslation("common");
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.branding}>
          <span className={styles.poweredBy}>
            {t("powered-by", {
              defaultValue: "Powered by",
            })}
          </span>
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
            label={t("learn-more", {
              defaultValue: "Learn More",
            })}
            theme="grey"
          />
        </a>
      </div>
    </footer>
  );
}
