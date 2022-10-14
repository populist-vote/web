import classNames from "classnames";
import { OfficeResult } from "generated";
import styles from "./OfficeSection.module.scss";

function OfficeSection({
  currentOffice,
}: {
  currentOffice: Partial<OfficeResult>;
}) {
  const cx = classNames(
    styles.center,
    styles.borderTop,
    styles.politicianOffice
  );

  const officeTitle = currentOffice.title;
  const officeSubtitle = currentOffice.subtitle;

  return (
    <section className={cx}>
      <h2 className={styles.politicianOffice}>{officeTitle}</h2>
      <h3>{officeSubtitle}</h3>
    </section>
  );
}

export { OfficeSection };
