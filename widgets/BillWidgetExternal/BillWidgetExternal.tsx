import { useQuery } from "@tanstack/react-query";
import { LoaderFlag } from "components";
import { BillWidget } from "components/BillWidget/BillWidget";
import { FaExclamationCircle } from "react-icons/fa";

import styles from "./BillWidgetExternal.module.scss";

function BillWidgetExternal({
  apiKey,
  billId,
}: {
  apiKey: string;
  billId: string;
}) {
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

  return <BillWidget bill={bill} />;
}

export { BillWidgetExternal };
