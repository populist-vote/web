import clsx from "clsx";
import { LoaderFlag } from "components/LoaderFlag/LoaderFlag";
import { usePoliticianCurrentOfficeQuery } from "generated";
import { useRouter } from "next/router";
import styles from "./OfficeSection.module.scss";

function OfficeSection() {
  const cx = clsx(styles.center, styles.borderTop);
  const { query } = useRouter();
  const { data, isLoading } = usePoliticianCurrentOfficeQuery({
    slug: query.politicianSlug as string,
  });

  const officeTitle = data?.politicianBySlug?.currentOffice?.title;
  const officeSubtitle = data?.politicianBySlug?.currentOffice?.subtitle;

  if (isLoading) return <LoaderFlag />;
  if (!officeTitle) return null;

  return (
    <section className={cx}>
      <h2 className={styles.politicianOffice}>{officeTitle}</h2>
      <h3>{officeSubtitle}</h3>
    </section>
  );
}

export { OfficeSection };
