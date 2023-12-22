import { Box } from "components/Box/Box";
import { useRouter } from "next/router";
import { useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { BillFiltersDesktop } from "./BillFiltersDesktop";
import styles from "./BillSearchAndFilters.module.scss";
import { Select } from "components/Select/Select";
import {
  BillStatus,
  PoliticalScope,
  useBillIssueTagsQuery,
  useBillYearsQuery,
} from "generated";
import { useBillFilters } from "hooks/useBillFilters";
import {
  pascalCaseToScreamingSnakeCase,
  pascalCaseToTitleCase,
} from "utils/strings";
import clsx from "clsx";
import { Theme } from "hooks/useTheme";
import * as Separator from "@radix-ui/react-separator";

export function BillSearchAndFilters({ theme = "yellow" }: { theme: Theme }) {
  const router = useRouter();
  const { query } = router;
  const { search, showFilters = "false" } = query;
  const [searchValue, setSearchValue] = useState(search);
  const showFiltersParam = showFilters === "true";

  const { year, state, scope, issue, status } = query || {};

  const { handleYearFilter, handleIssueTagFilter, handleStatusFilter } =
    useBillFilters();

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
    router.push({
      query: { ...query, state: e.target.value },
    });

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

  const {
    data: { billIssueTags } = {},
    isLoading: tagsLoading,
    error: tagsError,
  } = useBillIssueTagsQuery();
  const hasBillIssues =
    !tagsLoading && billIssueTags && billIssueTags?.length > 0;

  const billStatuses = (
    Object.keys(BillStatus) as Array<keyof typeof BillStatus>
  ).map((key) => ({
    value: pascalCaseToScreamingSnakeCase(key),
    label: pascalCaseToTitleCase(key),
  }));

  return (
    <Box>
      <div className={styles.flex}>
        {scope === PoliticalScope.State && (
          <Select
            textColor="blue-dark"
            backgroundColor={theme}
            value={state as string}
            options={[
              { value: "CO", label: "Colorado" },
              { value: "MN", label: "Minnesota" },
            ]}
            onChange={handleStateChange}
          />
        )}
        <div className={styles.inputWithIcon}>
          <input
            placeholder="Search for legislation"
            onChange={(e) => {
              setSearchValue(e.target.value);
              void router.push({
                query: { ...query, search: e.target.value },
              });
            }}
            value={searchValue || ""}
          />
          <AiOutlineSearch color="var(--blue)" size={"1.25rem"} />
        </div>
        {!yearsLoading && !yearsError && (
          <Select
            textColor="blue-dark"
            backgroundColor={theme}
            onChange={handleYearFilter}
            value={year as string}
            options={billYearOptions || []}
          />
        )}
      </div>
      <Separator.Root
        className={styles.SeparatorRoot}
        decorative
        style={{
          margin: "1rem 0",
          height: "1px",
          backgroundColor: `var(--${theme}-dark)`,
        }}
      />
      <div className={clsx(styles.flex)}>
        {hasBillIssues && !tagsError && (
          <Select
            border="solid"
            accentColor={theme}
            value={(issue as string) || "any"}
            onChange={handleIssueTagFilter}
            placeholder="Select an issue"
            options={[
              {
                value: "any",
                label: "Any Issue",
              },
              ...(billIssueTags?.map((issue) => ({
                value: issue.slug,
                label: issue.name,
              })) || []),
            ]}
          />
        )}
        <Select
          border="solid"
          accentColor={theme}
          options={[
            {
              value: "any",
              label: "Any Status",
            },
            ...billStatuses,
          ]}
          value={(status as string) || "any"}
          onChange={(e) => handleStatusFilter(e.target.value as BillStatus)}
          placeholder="Any Status"
        />
      </div>
      {showFiltersParam && <BillFiltersDesktop theme={theme} />}
    </Box>
  );
}
