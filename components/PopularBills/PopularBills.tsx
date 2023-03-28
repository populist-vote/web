import clsx from "clsx";
import { BillCard } from "components/BillCard/BillCard";
import { LoaderFlag } from "components/LoaderFlag/LoaderFlag";
import { BillResult, usePopularBillsQuery } from "generated";
import styles from "../BillResults/BillResults.module.scss";

function PopularBills() {
  const { data, isLoading, error } = usePopularBillsQuery(
    {
      pageSize: 10,
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  const popularBills = data?.popularBills.edges.map((edge) => edge.node) || [];

  return (
    <section className={styles.billsSection}>
      <h2 className={styles.gradientHeader}>Popular Bills</h2>
      {isLoading ? (
        <LoaderFlag />
      ) : error ? (
        <span>{error.toString()}</span>
      ) : (
        <>
          <div className={clsx(styles.billResults)}>
            {popularBills?.length > 0 ? (
              popularBills?.map((bill) => (
                <BillCard bill={bill as BillResult} key={bill.id} />
              ))
            ) : (
              <p className={styles.noResults}>No Results</p>
            )}
          </div>
        </>
      )}
    </section>
  );
}

export { PopularBills };
