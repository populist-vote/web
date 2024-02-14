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
import useDebounce from "hooks/useDebounce";
import { useRouter } from "next/router";
import styles from "./BillResults.module.scss";

function BillResults() {
  const router = useRouter();
  const { query } = router;
  const {
    state = null,
    status = null,
    search = null,
    year = null,
    scope = null,
    popularity = null,
    issue = null,
  } = query;

  const shouldFetchBillResults =
    !!search || !!state || !!status || !!year || !!popularity || !!issue;

  const debouncedSearchQuery = useDebounce<string | null>(
    search as string,
    350
  );

  const { data, isLoading, error } = useBillIndexQuery(
    {
      pageSize: 20,
      filter: {
        query: debouncedSearchQuery || null,
        state: state as State,
        politicalScope: scope as PoliticalScope,
        year: parseInt(year as string),
        status: status as BillStatus,
        issueTag: issue as string,
      },
      sort: {
        popularity: popularity as PopularitySort,
      },
    },
    {
      refetchOnWindowFocus: false,
      enabled: shouldFetchBillResults,
    }
  );

  const billResults = data?.bills.edges.map((edge) => edge.node) || [];

  if (!shouldFetchBillResults) return null;

  return (
    <section className={styles.billsSection}>
      <h2 className={styles.gradientHeader}>Search Results</h2>
      {isLoading ? (
        <LoaderFlag />
      ) : error ? (
        <span>{error.toString()}</span>
      ) : (
        <div className={styles.billResults}>
          {billResults?.length > 0 ? (
            billResults?.map((bill) => (
              <BillCard bill={bill as BillResult} key={bill.id} />
            ))
          ) : (
            <p className={styles.noResults}>No Results</p>
          )}
        </div>
      )}
    </section>
  );
}

export { BillResults };
