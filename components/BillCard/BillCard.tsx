import Link from "next/link";
import styles from "./BillCard.module.scss";
import { BillResult, BillStatus, useBillByIdQuery } from "generated";
import { Badge } from "components/Badge/Badge";
import { splitAtDigitAndJoin, titleCase } from "utils/strings";
import { getStatusInfo } from "utils/bill";
import { FaCheckCircle, FaCircle } from "react-icons/fa";
import { RiCloseCircleFill } from "react-icons/ri";
import { getYear } from "utils/dates";
import { ReactNode } from "react";
import { getIssueTagIcon } from "utils/data";
import * as Tooltip from "@radix-ui/react-tooltip";

interface BillCardWithBill {
  isLink?: boolean;
  bill: Partial<BillResult>;
  billId?: never;
}

interface BillCardWithBillId {
  isLink?: boolean;
  billId: string;
  bill?: never;
}

type BillCardProps = BillCardWithBill | BillCardWithBillId;

function LinkWrapper({
  children,
  href,
  isLink = true,
}: {
  children: ReactNode;
  href: string;
  isLink?: boolean;
}) {
  if (!isLink) return <>{children}</>;
  return (
    <Link href={href} passHref>
      {children}
    </Link>
  );
}

function BillCard({ bill, billId, isLink = true }: BillCardProps) {
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
    <LinkWrapper href={`/bills/${bill.slug}`} key={bill.slug} isLink={isLink}>
      <div className={styles.billCard}>
        <header className={styles.header}>
          <strong>
            {bill.state || "U.S."} -{" "}
            {splitAtDigitAndJoin(bill?.billNumber || "")}
          </strong>
          <strong>{getYear(bill.session?.startDate)}</strong>
        </header>
        <div className={styles.cardContent}>
          <h2 className={styles.title}>{bill.populistTitle ?? bill.title}</h2>
          <div className={styles.tags}>
            {bill.issueTags?.slice(0, 1).map((tag) => (
              <Badge key={tag.id} lightBackground>
                <span>{getIssueTagIcon(tag)}</span> {tag.name}
              </Badge>
            ))}
            {bill.issueTags && bill.issueTags?.length > 1 && (
              <Tooltip.Provider delayDuration={300}>
                <Tooltip.Root>
                  <Tooltip.Trigger className={styles.TooltipTrigger}>
                    <Badge lightBackground>
                      <span>+{bill.issueTags?.length - 1}</span>
                    </Badge>
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Content
                      className={styles.TooltipContent}
                      sideOffset={5}
                    >
                      {bill.issueTags
                        .slice(1, bill.issueTags.length)
                        .map((tag) => tag.name)
                        .join(", ")}
                      <Tooltip.Arrow className={styles.TooltipArrow} />
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>
              </Tooltip.Provider>
            )}
          </div>
        </div>
        <footer className={styles.footer}>
          <Badge
            iconLeft={
              <FaCircle size={12} color={`var(--${statusInfo?.color})`} />
            }
            theme={statusInfo?.color}
            lightBackground
            size="small"
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
    </LinkWrapper>
  );
}

export { BillCard };
