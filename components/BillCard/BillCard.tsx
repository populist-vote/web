import Link from "next/link";
import styles from "./BillCard.module.scss";
import { BillResult, BillStatus } from "generated";
import { Badge } from "components/Badge/Badge";
import { splitAtDigitAndJoin, titleCase } from "utils/strings";
import { getStatusInfo } from "utils/bill";
import { FaCheckCircle, FaCircle } from "react-icons/fa";
import { RiCloseCircleFill } from "react-icons/ri";
import { getYear } from "utils/dates";

function BillCard({
  bill,
}: {
  bill: Partial<BillResult>;
  [x: string]: unknown;
}) {
  const statusInfo = getStatusInfo(bill.status as BillStatus);

  return (
    <Link href={`/bills/${bill.slug}`} key={bill.slug} passHref>
      <div className={styles.billCard}>
        <header className={styles.header}>
          <strong>
            {bill.state || "U.S."} -{" "}
            {splitAtDigitAndJoin(bill?.billNumber || "")}
          </strong>
          <strong>{getYear(bill.session?.startDate)}</strong>
        </header>
        <div className={styles.cardContent}>
          <h2 className={styles.title}>{bill.title}</h2>
          <div className={styles.tags}>
            {bill.issueTags?.map((tag) => (
              <Badge key={tag.id}>{tag.name}</Badge>
            ))}
          </div>
        </div>
        <footer className={styles.footer}>
          <Badge
            iconLeft={
              <FaCircle size={12} color={`var(--${statusInfo?.color})`} />
            }
            color={statusInfo?.color}
          >
            {titleCase(bill?.status?.replaceAll("_", " ") as string)}
          </Badge>
          <div className={styles.votes}>
            <Badge
              iconLeft={
                <FaCheckCircle size={18} color="var(--green-support)" />
              }
            >
              {bill?.publicVotes?.support ?? 0}
            </Badge>
            <Badge
              iconLeft={<RiCloseCircleFill size={18} color="var(--red)" />}
            >
              {bill?.publicVotes?.oppose ?? 0}
            </Badge>
          </div>
        </footer>
      </div>
    </Link>
  );
}

export { BillCard };
