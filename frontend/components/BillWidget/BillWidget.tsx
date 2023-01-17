import { useQuery } from "@tanstack/react-query";
import { Button, LoaderFlag, PartyAvatar } from "components";
import { Badge } from "ui/components/Badge/Badge";
import { LogoTextDark } from "components/Logo";
import {
  BillStatus,
  IssueTagResult,
  PoliticalParty,
  PoliticianResult,
} from "generated";
import { FaCheckCircle, FaCircle, FaExclamationCircle } from "react-icons/fa";
import { RiCloseCircleFill } from "react-icons/ri";
import { getStatusInfo } from "utils/bill";
import { getYear } from "utils/dates";
import { splitAtDigitAndJoin, titleCase } from "utils/strings";
import styles from "./BillWidget.module.scss";

function BillWidget({ apiKey, billId }: { apiKey: string; billId: string }) {
  const { data, isLoading } = useQuery(["bill", billId], () => {
    return fetch(`https://api.staging.populist.us/graphql`, {
      method: "POST",
      body: JSON.stringify({
        query: `
          query BillById($billId: String!)  {
            billById(id: $billId) {
            	id
							slug
							title
							description
							billNumber
              state
							status
							officialSummary
							populistSummary
							fullTextUrl
							legiscanCommitteeName
							issueTags {
                id
                name
                slug
							}
							sponsors {
                id
                slug
                party
                thumbnailImageUrl
                fullName
                currentOffice {
                    id
                    officeType
                    state
                    district
                }
							}
							session {
                name 
                startDate
                endDate
							}
							publicVotes {
                support
                neutral
                oppose
							}
            }
          }
        `,
        variables: {
          billId,
        },
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
    }).then((res) => res.json());
  });

  if (isLoading) {
    return (
      <div className={styles.billCard}>
        <LoaderFlag />
      </div>
    );
  }

  if (data.errors)
    return (
      <div
        className={styles.billCard}
        style={{ display: "flex", justifyContent: "center" }}
      >
        {data.errors.map((error: { message: string }) => (
          <div key={error.message} className={styles.error}>
            <FaExclamationCircle /> {error.message}
          </div>
        ))}
      </div>
    );

  const bill = data?.data?.billById;

  if (!bill) {
    return <div>Bill not found</div>;
  }

  const statusInfo = getStatusInfo(bill?.status as BillStatus);

  return (
    <div className={styles.billCard}>
      <header className={styles.header}>
        <strong>
          {bill.state || "U.S."} - {splitAtDigitAndJoin(bill.billNumber)}
        </strong>
        <strong>{getYear(bill.session?.endDate)}</strong>
      </header>
      <section className={styles.cardContent}>
        <div>
          <h2 className={styles.title}>{bill.title}</h2>
          <div className={styles.tags}>
            {bill.issueTags?.map((tag: Partial<IssueTagResult>) => (
              <Badge key={tag.id}>{tag.name}</Badge>
            ))}
          </div>
          <div className={styles.description}>
            <p>{bill.description}</p>
          </div>
          <a href={bill.fullTextUrl} target="_blank" rel="noreferrer">
            <Button
              variant="secondary"
              size="medium"
              label="Read Full Text"
              style={{
                background: "var(--grey-lighter)",
                color: "var(--blue-dark)",
              }}
            />
          </a>
        </div>
        {bill.sponsors?.length > 0 && (
          <section className={styles.sponsors}>
            <h4>Sponsors</h4>
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
                  <span>{sponsor.currentOffice?.officeType}</span>
                </div>
              </div>
            ))}
          </section>
        )}
      </section>
      <footer className={styles.footer}>
        <Badge
          iconLeft={
            <FaCircle size={12} color={`var(--${statusInfo?.color})`} />
          }
          color={statusInfo?.color}
        >
          {titleCase(bill.status?.replaceAll("_", " ") as string)}
        </Badge>
        <div className={styles.votes}>
          <Badge
            color="grey-dark"
            iconLeft={<FaCheckCircle size={18} color="var(--green-support)" />}
          >
            {bill.publicVotes?.support ?? 0}
          </Badge>
          <Badge
            color="grey-dark"
            iconLeft={<RiCloseCircleFill size={18} color="var(--red)" />}
          >
            {bill.publicVotes?.oppose ?? 0}
          </Badge>
        </div>

        <div className={styles.branding}>
          <span className={styles.poweredBy}>Powered by</span>
          <LogoTextDark />
        </div>
      </footer>
    </div>
  );
}

export { BillWidget };
