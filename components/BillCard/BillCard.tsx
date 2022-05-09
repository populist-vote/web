import Link from "next/link";
import styles from "./BillCard.module.scss";
import type { BillResult } from "generated";

const BillCard = ({ bill, itemId }: { bill: Partial<BillResult>, itemId: string }) => {
  return (
    <div className={styles.billPage}>
      <Link href={`/bills/${bill.slug}`} key={bill.slug} passHref>
        <div className={styles.billCard}>
          <div className={styles.cardContent}>
            <h1 className={styles.billNumber}>{bill.billNumber}</h1>
            <h2 className={styles.billTitle}>{bill.title}</h2>
            <span className={styles.statusPill}>
              {bill.legislationStatus?.replace("_", " ")}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default BillCard;
