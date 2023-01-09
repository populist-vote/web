import {
  useQuery,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { Button, PartyAvatar } from "components";
import { Badge } from "components/Badge/Badge";
import {
  BillStatus,
  IssueTagResult,
  PoliticalParty,
  PoliticianResult,
} from "generated";
import { FaCheckCircle, FaCircle } from "react-icons/fa";
import { RiCloseCircleFill } from "react-icons/ri";
import { getStatusInfo } from "utils/bill";
import { getYear } from "utils/dates";
import { titleCase } from "utils/strings";
import styles from "./BillWidget.module.scss";

const queryClient = new QueryClient();

function BillWidget({ apiKey }: { apiKey: string }) {
  const billId = "1c3262b1-ba29-430c-a294-beedddfb7070";
  const { data, isLoading } = useQuery(["bill", billId], () => {
    return fetch(`https://api.staging.populist.us`, {
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
    return <div>Loading...</div>;
  }

  const bill = data?.data?.billById;

  if (!bill) {
    return <div>Bill not found</div>;
  }

  const statusInfo = getStatusInfo(bill?.status as BillStatus);

  return (
    <div className={styles.billCard}>
      <header className={styles.header}>
        <strong>{bill.billNumber}</strong>
        <strong>{getYear(bill.session?.endDate)}</strong>
      </header>
      <div className={styles.cardContent}>
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
        <div className={styles.sponsors}>
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
        </div>
      </div>
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
      </footer>
    </div>
  );
}

function Main() {
  return (
    <QueryClientProvider client={queryClient}>
      <BillWidget apiKey={process.env.POPULIST_API_KEY as string} />
    </QueryClientProvider>
  );
}

export { Main as BillWidget };
