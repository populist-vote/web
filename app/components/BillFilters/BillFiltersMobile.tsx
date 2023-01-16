import { Badge } from "components/Badge/Badge";
import { Button } from "components/Button/Button";
import { Select } from "components/Select/Select";
import { BillStatus, PopularitySort } from "graphql-codegen/generated";
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

  useLayoutEffect(() => {
    if (shouldFocusSearch === "true") {
      searchRef?.current?.focus();
    }
  }, [shouldFocusSearch, searchRef]);

  return (
    <div className={styles.container}>
      <section>
        <h4>Year</h4>
        <Select
          backgroundColor="blue"
          onChange={handleYearFilter}
          value={year}
          options={[
            { value: "2022", label: "2022" },
            { value: "2021", label: "2021" },
            { value: "2020", label: "2020" },
          ]}
        />
      </section>
      <section>
        <h4>Sort by Popularity</h4>
        <div className={styles.badgeGroup}>
          <Badge
            color="blue"
            label="Most Popular"
            selected={popularity === PopularitySort.MostPopular}
            onClick={() => handlePopularitySort(PopularitySort.MostPopular)}
          />
          <Badge
            color="green"
            label="Most Supported"
            selected={popularity === PopularitySort.MostSupported}
            onClick={() => handlePopularitySort(PopularitySort.MostSupported)}
          />
          <Badge
            color="red"
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
            color="violet"
            label="Introduced"
            selected={status === BillStatus.Introduced}
            onClick={() => handleStatusFilter(BillStatus.Introduced)}
          />
          <Badge
            color="orange"
            label="In Consideration"
            selected={status === BillStatus.InConsideration}
            onClick={() => handleStatusFilter(BillStatus.InConsideration)}
          />
          <Badge
            color="green"
            label="Became Law"
            selected={status === BillStatus.BecameLaw}
            onClick={() => handleStatusFilter(BillStatus.BecameLaw)}
          />
          <Badge
            color="red"
            label="Failed"
            selected={status === BillStatus.Failed}
            onClick={() => handleStatusFilter(BillStatus.Failed)}
          />
          <Badge
            color="red"
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
