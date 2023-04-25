import { Badge } from "components/Badge/Badge";
import { Button } from "components/Button/Button";
import { Select } from "components/Select/Select";
import { BillStatus, PopularitySort, useBillYearsQuery } from "generated";
import { useBillFilters } from "hooks/useBillFilters";
import { useRouter } from "next/router";
import { BillIndexProps } from "pages/bills";
import { useLayoutEffect } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import styles from "./BillFiltersMobile.module.scss";

function BillFiltersMobile(props: BillIndexProps) {
  const router = useRouter();
  const query = router.query;
  const { popularity, year, status, shouldFocusSearch } = props.query || query;

  const {
    searchRef,
    searchValue,
    setSearchValue,
    handlePopularitySort,
    handleYearFilter,
    handleStatusFilter,
    handleCancel,
    handleApplyFilters,
  } = useBillFilters();

  const {
    data: { billYears } = {},
    isLoading: yearsLoading,
    error: yearsError,
  } = useBillYearsQuery();

  const billYearOptions = billYears
    ?.sort((a, b) => b - a)
    .map((year) => ({
      value: year.toString(),
      label: year.toString(),
    }));

  useLayoutEffect(() => {
    if (shouldFocusSearch === "true") {
      searchRef?.current?.focus();
    }
  }, [shouldFocusSearch, searchRef]);

  return (
    <div className={styles.container}>
      {!yearsLoading && !yearsError && (
        <section className={styles.flex}>
          <h4>Year</h4>
          <Select
            textColor="blue-dark"
            backgroundColor="yellow"
            placeholder="Select Year"
            onChange={handleYearFilter}
            value={year as string}
            options={billYearOptions || []}
          />
        </section>
      )}
      <section>
        <h4>Sort by Popularity</h4>
        <div className={styles.badgeGroup}>
          <Badge
            theme="blue"
            label="Most Popular"
            selected={popularity === PopularitySort.MostPopular}
            onClick={() => handlePopularitySort(PopularitySort.MostPopular)}
          />
          <Badge
            theme="green-support"
            label="Most Supported"
            selected={popularity === PopularitySort.MostSupported}
            onClick={() => handlePopularitySort(PopularitySort.MostSupported)}
          />
          <Badge
            theme="red"
            label="Most Opposed"
            selected={popularity === PopularitySort.MostOpposed}
            onClick={() => handlePopularitySort(PopularitySort.MostOpposed)}
          />
        </div>
      </section>
      <section>
        <h4>Progress</h4>
        <div className={styles.badgeGroup}>
          <Badge
            theme="violet"
            label="Introduced"
            selected={status === BillStatus.Introduced}
            onClick={() => handleStatusFilter(BillStatus.Introduced)}
          />
          <Badge
            theme="orange"
            label="In Consideration"
            selected={status === BillStatus.InConsideration}
            onClick={() => handleStatusFilter(BillStatus.InConsideration)}
          />
          <Badge
            theme="green-support"
            label="Became Law"
            selected={status === BillStatus.BecameLaw}
            onClick={() => handleStatusFilter(BillStatus.BecameLaw)}
          />
          <Badge
            theme="red"
            label="Failed"
            selected={status === BillStatus.Failed}
            onClick={() => handleStatusFilter(BillStatus.Failed)}
          />
          <Badge
            theme="red"
            label="Vetoed"
            selected={status === BillStatus.Vetoed}
            onClick={() => handleStatusFilter(BillStatus.Vetoed)}
          />
        </div>
      </section>
      <section>
        <div className={styles.actions}>
          <Button
            variant="primary"
            size="medium"
            label="Apply"
            onClick={handleApplyFilters}
          />
          <Button
            variant="secondary"
            size="medium"
            label="Cancel"
            onClick={handleCancel}
          />
        </div>
        <div className={styles.inputWithIcon}>
          <input
            placeholder="Search"
            ref={searchRef}
            onChange={(e) => {
              setSearchValue(e.target.value);
              void router.push({ query: { ...query, search: e.target.value } });
            }}
            value={searchValue || ""}
          />
          <AiOutlineSearch color="var(--blue)" size={"1.25rem"} />
        </div>
      </section>
    </div>
  );
}

export { BillFiltersMobile };
