import classNames from "classnames";
import { LoaderFlag } from "components/LoaderFlag/LoaderFlag";
import { usePoliticianCurrentOfficeQuery } from "generated";
import { useRouter } from "next/router";
import styles from "./OfficeSection.module.scss";

function OfficeSection() {
  const cx = classNames(
    styles.center,
    styles.borderTop,
    styles.politicianOffice
  );
  const { query } = useRouter();
  const { data, isLoading } = usePoliticianCurrentOfficeQuery({
    slug: query.slug as string,
  });

  const officeTitle = data?.politicianBySlug?.currentOffice?.title;
  const officeSubtitle = data?.politicianBySlug?.currentOffice?.subtitle;

  if (isLoading) return <LoaderFlag />;

  return (
    <section className={cx}>
      <h2 className={styles.politicianOffice}>{officeTitle}</h2>
      <h3>{officeSubtitle}</h3>
    </section>
  );
}

export { OfficeSection };
