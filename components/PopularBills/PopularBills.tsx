import clsx from "clsx";
import { BillCard } from "components/BillCard/BillCard";
import { LoaderFlag } from "components/LoaderFlag/LoaderFlag";
import {
  BillResult,
  BillStatus,
  PoliticalScope,
  PopularitySort,
  State,
  useBillIndexQuery,
} from "generated";
import styles from "../BillResults/BillResults.module.scss";
import { useRouter } from "next/router";
import useDebounce from "hooks/useDebounce";

function PopularBills() {
  const router = useRouter();
  const { query } = router;
  const {
    state = null,
    status = null,
    search = null,
    year = null,
    scope = "FEDERAL",
    issue = null,
  } = query;

  const debouncedSearchQuery = useDebounce<string | null>(
    search as string,
    350
  );

  const { data, isLoading, error } = useBillIndexQuery(
    {
      pageSize: 5,
      sort: {
        popularity: PopularitySort.MostOpposed,
      },
      filter: {
        query: debouncedSearchQuery || null,
        state: state as State,
        politicalScope: scope as PoliticalScope,
        year: parseInt(year as string),
        status: status as BillStatus,
        issueTag: issue as string,
      },
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  const popularBills = data?.bills.edges.map((edge) => edge.node) || [];

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
