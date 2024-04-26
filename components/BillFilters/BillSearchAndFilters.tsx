import { Box } from "components/Box/Box";
import { useRouter } from "next/router";
import { useState } from "react";
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
import { useAuth } from "hooks/useAuth";
import { SearchInput } from "components/SearchInput/SearchInput";

export function BillSearchAndFilters({ theme = "yellow" }: { theme: Theme }) {
  const { user } = useAuth();
  const router = useRouter();
  const { query } = router;
  const { search, showFilters = "false" } = query;
  const [searchValue, setSearchValue] = useState<string>(search as string);
  const showFiltersParam = showFilters === "true";
  const defaultState = user?.userProfile?.address?.state || "any";
  const { year, state = defaultState, scope, issue, status } = query || {};

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
        <SearchInput
          placeholder="Search for legislation"
          searchValue={searchValue as string}
          setSearchValue={setSearchValue}
        />
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
        {router.pathname.includes("/embeds/") && (
          <Select
            border="solid"
            accentColor={theme}
            value={state as string}
            onChange={handleStateChange}
            options={[
              {
                value: "any",
                label: "Any State",
              },
              {
                value: "MN",
                label: "Minnesota",
              },
              {
                value: "CO",
                label: "Colorado",
              },
            ]}
          />
        )}
      </div>
      {showFiltersParam && <BillFiltersDesktop theme={theme} />}
    </Box>
  );
}
