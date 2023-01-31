import clsx from "clsx";
import { BillCard } from "components/BillCard/BillCard";
import { LoaderFlag } from "components/LoaderFlag/LoaderFlag";
import {
  BillResult,
  PoliticalScope,
  State,
  usePopularBillsQuery,
} from "generated";
import useDebounce from "hooks/useDebounce";
import { useRouter } from "next/router";
import { BillIndexProps } from "pages/bills";
import styles from "../BillResults/BillResults.module.scss";

function PopularBills(props: BillIndexProps) {
  const router = useRouter();
  const { query } = router;
  const {
    state = null,
    status = null,
    search = null,
    scope = PoliticalScope.Federal,
  } = props.query || query;

  const debouncedSearchQuery = useDebounce<string | null>(
    search as string,
    350
  );

  const { data, isLoading, error } = usePopularBillsQuery(
    {
      pageSize: 10,
      filter: {
        query: debouncedSearchQuery || null,
        state: state as State,
        politicalScope: scope,
        status,
      },
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
