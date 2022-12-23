import clsx from "clsx";
import { Badge } from "components/Badge/Badge";
import { Select } from "components/Select/Select";
import { BillStatus, PopularitySort } from "generated";
import { useBillFilters } from "hooks/useBillFilters";
import { useRouter } from "next/router";
import { BillIndexProps } from "pages/bills";
import { useLayoutEffect } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import styles from "./BillFiltersDesktop.module.scss";

function BillFiltersDesktop(props: BillIndexProps) {
  const router = useRouter();
  const query = router.query;
  const { popularity, year, issue, status, shouldFocusSearch } =
    props.query || query;

  const {
    searchRef,
    searchValue,
    setSearchValue,
    handleYearFilter,
    handleIssueTagFilter,
    handleStatusFilter,
    handlePopularitySort,
  } = useBillFilters();

  useLayoutEffect(() => {
    if (shouldFocusSearch === "true") {
      searchRef?.current?.focus();
    }
  }, [shouldFocusSearch, searchRef]);

  return (
    <div className={styles.container}>
      <div className={styles.row}>
        <section className={styles.flex}>
          <h4>Year</h4>
          <Select
            color="blue-dark"
            backgroundColor="yellow"
            onChange={handleYearFilter}
            value={year}
            options={[
              { value: "2022", label: "2022" },
              { value: "2020", label: "2020" },
            ]}
          />
        </section>
        <section className={styles.flex}>
          <h4>Issue</h4>
          <Select
            color="blue-dark"
            backgroundColor="yellow"
            onChange={handleIssueTagFilter}
            value={issue}
            placeholder="Select an issue"
            options={[
              { value: "health-care", label: "Health Care" },
              { value: "abortion", label: "Abortion" },
            ]}
          />
        </section>
        <section className={styles.flex}>
          <h4>Committee</h4>
          <Select
            color="blue-dark"
            backgroundColor="yellow"
            onChange={handleYearFilter}
            value={year}
            options={[
              { value: "2022", label: "2022" },
              { value: "2020", label: "2020" },
            ]}
          />
        </section>
      </div>

      <div className={styles.row}>
        <section className={clsx(styles.flex, styles.mobileColumn)}>
          <h4>Progress</h4>
          <div className={styles.badgeGroup}>
            <Badge
              color="violet"
              clickable
              label="Introduced"
              selected={status === BillStatus.Introduced}
              onClick={() => handleStatusFilter(BillStatus.Introduced)}
            />
            <Badge
              color="orange"
              clickable
              label="In Consideration"
              selected={status === BillStatus.InConsideration}
              onClick={() => handleStatusFilter(BillStatus.InConsideration)}
            />
            <Badge
              color="green"
              clickable
              label="Became Law"
              selected={status === BillStatus.BecameLaw}
              onClick={() => handleStatusFilter(BillStatus.BecameLaw)}
            />
            <Badge
              color="red"
              clickable
              label="Failed"
              selected={status === BillStatus.Failed}
              onClick={() => handleStatusFilter(BillStatus.Failed)}
            />
            <Badge
              color="red"
              clickable
              label="Vetoed"
              selected={status === BillStatus.Vetoed}
              onClick={() => handleStatusFilter(BillStatus.Vetoed)}
            />
          </div>
        </section>
      </div>
      <div className={styles.row}>
        <section className={clsx(styles.flex, styles.mobileColumn)}>
          <h4>Sort by Popularity</h4>
          <div className={styles.badgeGroup}>
            <Badge
              clickable
              color="blue"
              label="Most Popular"
              selected={popularity === PopularitySort.MostPopular}
              onClick={() => handlePopularitySort(PopularitySort.MostPopular)}
            />
            <Badge
              clickable
              color="green"
              label="Most Supported"
              selected={popularity === PopularitySort.MostSupported}
              onClick={() => handlePopularitySort(PopularitySort.MostSupported)}
            />
            <Badge
              clickable
              color="red"
              label="Most Opposed"
              selected={popularity === PopularitySort.MostOpposed}
              onClick={() => handlePopularitySort(PopularitySort.MostOpposed)}
            />
          </div>
        </section>
      </div>

      <div className={styles.row}>
        <section className={styles.flex}>
          <h4>Sponsor</h4>
          <div className={styles.inputWithIcon}>
            <input
              placeholder="Search for politicians"
              onChange={(e) => {
                setSearchValue(e.target.value);
                void router.push({
                  query: { ...query, search: e.target.value },
                });
              }}
              value={searchValue || ""}
            ></input>
            <AiOutlineSearch color="var(--blue)" size={"1.25rem"} />
          </div>
        </section>
        <section className={styles.flex}>
          <h4>RESULTS</h4>
        </section>
      </div>
    </div>
  );
}

export { BillFiltersDesktop };
