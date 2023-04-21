import clsx from "clsx";
import { Badge } from "components/Badge/Badge";
import { Select } from "components/Select/Select";
import {
  BillStatus,
  PopularitySort,
  useBillCommitteesQuery,
  useBillIssueTagsQuery,
  useBillYearsQuery,
} from "generated";
import { useBillFilters } from "hooks/useBillFilters";
import { useRouter } from "next/router";
import styles from "./BillFiltersDesktop.module.scss";

function BillFiltersDesktop() {
  const router = useRouter();
  const query = router.query;
  const { popularity, year, issue, committee, status } = query || {};

  const {
    handleYearFilter,
    handleIssueTagFilter,
    handleCommitteeFilter,
    handleStatusFilter,
    handlePopularitySort,
  } = useBillFilters();

  const {
    data: { billIssueTags } = {},
    isLoading: tagsLoading,
    error: tagsError,
  } = useBillIssueTagsQuery();
  const {
    data: { billCommittees } = {},
    isLoading: committeesLoading,
    error: committeesError,
  } = useBillCommitteesQuery();
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

  const hasBillIssues =
    !tagsLoading && billIssueTags && billIssueTags?.length > 0;

  const hasBillCommittees =
    !committeesLoading && billCommittees && billCommittees?.length > 0;

  const errors = [tagsError, committeesError].filter(Boolean);

  if (errors.length > 0)
    return <div>Something went wrong loading legislation filters</div>;

  return (
    <div className={styles.container}>
      <div className={styles.row}>
        {!yearsLoading && !yearsError && (
          <section className={styles.flex}>
            <h4>Year</h4>
            <Select
              textColor="blue-dark"
              backgroundColor="yellow"
              onChange={handleYearFilter}
              value={year as string}
              options={billYearOptions || []}
            />
          </section>
        )}
        {hasBillIssues && (
          <section className={styles.flex}>
            <h4>Issue</h4>
            <Select
              textColor={!!issue ? "blue-dark" : "yellow"}
              border="solid"
              backgroundColor={!!issue ? "yellow" : "transparent"}
              value={issue as string}
              onChange={handleIssueTagFilter}
              placeholder="Select an issue"
              options={billIssueTags.map((issue) => ({
                value: issue.slug,
                label: issue.name,
              }))}
            />
          </section>
        )}
        {hasBillCommittees && (
          <section className={styles.flex}>
            <h4>Issue</h4>
            <Select
              textColor={!!committee ? "blue-dark" : "yellow"}
              border="solid"
              backgroundColor={!!committee ? "yellow" : "transparent"}
              value={committee as string}
              onChange={handleCommitteeFilter}
              placeholder="Select a committee"
              options={billCommittees.map((committee) => ({
                value: committee.id,
                label: committee.slug,
              }))}
            />
          </section>
        )}
      </div>

      <div className={styles.row}>
        <section className={clsx(styles.flex, styles.mobileColumn)}>
          <h4>Progress</h4>
          <div className={styles.badgeGroup}>
            <Badge
              theme="violet"
              clickable
              label="Introduced"
              selected={status === BillStatus.Introduced}
              onClick={() => handleStatusFilter(BillStatus.Introduced)}
            />
            <Badge
              theme="orange"
              clickable
              label="In Consideration"
              selected={status === BillStatus.InConsideration}
              onClick={() => handleStatusFilter(BillStatus.InConsideration)}
            />
            <Badge
              theme="green-support"
              clickable
              label="Became Law"
              selected={status === BillStatus.BecameLaw}
              onClick={() => handleStatusFilter(BillStatus.BecameLaw)}
            />
            <Badge
              theme="red"
              clickable
              label="Failed"
              selected={status === BillStatus.Failed}
              onClick={() => handleStatusFilter(BillStatus.Failed)}
            />
            <Badge
              theme="red"
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
              theme="blue"
              label="Most Popular"
              selected={popularity === PopularitySort.MostPopular}
              onClick={() => handlePopularitySort(PopularitySort.MostPopular)}
            />
            <Badge
              clickable
              theme="green-support"
              label="Most Supported"
              selected={popularity === PopularitySort.MostSupported}
              onClick={() => handlePopularitySort(PopularitySort.MostSupported)}
            />
            <Badge
              clickable
              theme="red"
              label="Most Opposed"
              selected={popularity === PopularitySort.MostOpposed}
              onClick={() => handlePopularitySort(PopularitySort.MostOpposed)}
            />
          </div>
        </section>
      </div>
    </div>
  );
}

export { BillFiltersDesktop };
