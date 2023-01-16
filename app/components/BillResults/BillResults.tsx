import clsx from "clsx";
import { BillCard } from "components/BillCard/BillCard";
import { LoaderFlag } from "components/LoaderFlag/LoaderFlag";
import {
  BillResult,
  PoliticalScope,
  State,
  useBillIndexQuery,
} from "graphql-codegen/generated";
import useDebounce from "hooks/useDebounce";
import { useRouter } from "next/router";
import { BillIndexProps } from "pages/bills";
import styles from "../../pages/bills/BillIndex.module.scss";

function BillResults(props: BillIndexProps) {
  const router = useRouter();
  const { query } = router;
  const {
    state = null,
    status = null,
    search = null,
    year = null,
    scope = PoliticalScope.Federal,
    popularity = null,
  } = props.query || query;

  const shouldFetchBillResults =
    !!search || !!state || !!status || !!year || !!popularity;

  const debouncedSearchQuery = useDebounce<string | null>(
    search as string,
    350
  );

  const { data, isLoading, error } = useBillIndexQuery(
    {
      pageSize: 10,
      filter: {
        query: debouncedSearchQuery || null,
        state: state as State,
        politicalScope: scope,
        year: parseInt(year as string),
        status,
      },
      sort: {
        popularity,
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
        <>
          <div className={clsx(styles.billResults)}>
            {billResults?.length > 0 ? (
              billResults?.map((bill) => (
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

export { BillResults };
