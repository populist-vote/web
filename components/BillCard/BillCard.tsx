import Link from "next/link";
import styles from "./BillCard.module.scss";
import { BillResult, BillStatus, useBillByIdQuery } from "generated";
import { Badge } from "components/Badge/Badge";
import { splitAtDigitAndJoin, titleCase } from "utils/strings";
import { getStatusInfo } from "utils/bill";
import { FaCheckCircle, FaCircle } from "react-icons/fa";
import { RiCloseCircleFill } from "react-icons/ri";
import { getYear } from "utils/dates";

interface BillCardWithBill {
  bill: Partial<BillResult>;
  billId?: never;
}

interface BillCardWithBillId {
  billId: string;
  bill?: never;
}

type BillCardProps = BillCardWithBill | BillCardWithBillId;

function BillCard({ bill, billId }: BillCardProps) {
  const { data } = useBillByIdQuery(
    {
      id: billId as string,
    },
    {
      enabled: !!billId,
    }
  );

  bill = bill ? bill : (data?.billById as Partial<BillResult>);

  if (!bill) return null;

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
              <Badge key={tag.id} lightBackground>
                {tag.name}
              </Badge>
            ))}
          </div>
        </div>
        <footer className={styles.footer}>
          <Badge
            iconLeft={
              <FaCircle size={12} color={`var(--${statusInfo?.color})`} />
            }
            theme={statusInfo?.color}
            lightBackground
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
