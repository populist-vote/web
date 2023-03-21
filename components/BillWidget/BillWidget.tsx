import { Button, LoaderFlag, PartyAvatar } from "components";
import { Badge } from "components/Badge/Badge";
import { LogoTextDark } from "components/Logo";
import {
  BillResult,
  BillStatus,
  IssueTagResult,
  PoliticalParty,
  PoliticianResult,
  useBillByIdQuery,
} from "generated";
import { FaCheckCircle, FaCircle, FaQuestionCircle, FaTimesCircle } from "react-icons/fa";
import { getStatusInfo } from "utils/bill";
import { getYear } from "utils/dates";
import { splitAtDigitAndJoin, titleCase } from "utils/strings";
import styles from "./BillWidget.module.scss";

function BillWidget({ billId }: { billId: string }) {
  const { data, isLoading, error } = useBillByIdQuery({ id: billId });
  const bill = data?.billById as BillResult;
  const statusInfo = getStatusInfo(bill?.status as BillStatus);

  if (isLoading) return <LoaderFlag />;
  if (error) return <div>Something went wrong loading this bill.</div>;

  return (
    <div className={styles.billCard} data-test-id="populist-bill-widget">
      <header className={styles.header}>
        <strong>
          {bill.state || "U.S."} - {splitAtDigitAndJoin(bill.billNumber)}
        </strong>
        <strong>{getYear(bill.session?.startDate)}</strong>
      </header>
      <section className={styles.cardContent}>
        <div>
          <h2 className={styles.title}>{bill.title}</h2>
          <div className={styles.tags}>
            {bill.issueTags?.map((tag: Partial<IssueTagResult>) => (
              <Badge size ="small" theme="grey" key={tag.id} lightBackground>
                {tag.name}
              </Badge>
            ))}
          </div>
          <div className={styles.status}>
            <Badge
              size="small"
              font="primary"
              iconLeft={
                <FaCircle size={12} color={`var(--${statusInfo?.color})`} />
              }
              theme={statusInfo?.color}
              lightBackground
            >
              {titleCase(bill.status?.replaceAll("_", " ") as string)}
            </Badge>
          </div>
          <div className={styles.description}>
            <p>{bill.populistSummary}</p>
          </div>
          <a href={bill.fullTextUrl as string} target="_blank" rel="noreferrer">
            <Button
              variant="secondary"
              size="small"
              label="Full Text"
              style={{
                background: "var(--grey-lightest)",
                color: "var(--blue-dark)",
              }}
            />
          </a>
        </div>
        {bill.sponsors?.length > 0 && (
          <section className={styles.sponsors}>
            <h4>Sponsors</h4>
            <div className={styles.sponsorsScroller}>
              {bill.sponsors?.map((sponsor: Partial<PoliticianResult>) => (
                <div key={sponsor.id} className={styles.sponsor}>
                  <PartyAvatar
                    party={sponsor?.party as PoliticalParty}
                    src={sponsor?.thumbnailImageUrl as string}
                    alt={sponsor?.fullName as string}
                    size={80}
                  />
                  <div className={styles.sponsorInfo}>
                    <strong>{sponsor.fullName}</strong>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </section>
      <div className={styles.info}>
        
        <div className={styles.votes}>
          <Badge size="small" font="primary" style={{ width: "100%", justifyContent: "center" }}>
            
              <FaCheckCircle size={18} color="var(--green-support)" />
              SUPPORT –   
              {bill.publicVotes?.support ?? 0}
            
          </Badge>
          <Badge size="small" font="primary" style={{ width: "100%", justifyContent: "center" }}>
            <FaTimesCircle size={18} color="var(--red)" />
            OPPOSE –
            {bill.publicVotes?.oppose ?? 0}{" "}
          </Badge>
          <Badge size="small" font="primary" style={{ width: "100%", justifyContent: "center" }}>
            <FaQuestionCircle size={18} color="var(--orange)" />
            UNDECIDED –
            {bill.publicVotes?.oppose ?? 0}{" "}
          </Badge>
        </div>
      </div>
      <footer className={styles.footer}>
        <div className={styles.branding}>
          <span className={styles.poweredBy}>Powered by</span>
          <LogoTextDark />
        </div>
      </footer>
    </div>
  );
}

export { BillWidget };
