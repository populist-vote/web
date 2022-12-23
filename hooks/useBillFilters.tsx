import { BillStatus, PoliticalScope, PopularitySort } from "generated";
import { useRouter } from "next/router";
import { ChangeEvent, useRef, useState } from "react";

function useBillFilters() {
  const router = useRouter();
  const query = router.query;
  const initialQueryRef = useRef(query);
  const { search, popularity, status } = query;
  const [searchValue, setSearchValue] = useState<string | null>(
    (search as string) || ""
  );
  const searchRef = useRef<HTMLInputElement>(null);

  const handleScopeFilter = (scope: PoliticalScope) => {
    if (scope === PoliticalScope.Federal) {
      const { state: _, ...newQuery } = query;
      void router.push({ query: { ...newQuery, scope } });
    } else {
      void router.push({ query: { ...query, scope } });
    }
  };

  const handlePopularitySort = (value: PopularitySort) => {
    if (popularity === value) {
      const { popularity: _, ...newQuery } = query;
      void router.push({ query: newQuery });
    } else {
      void router.push({
        query: { ...query, popularity: value },
      });
    }
  };

  const handleYearFilter = (e: ChangeEvent<HTMLSelectElement>) => {
    void router.push({
      query: { ...query, year: e.target.value },
    });
  };

  const handleStatusFilter = (value: BillStatus) => {
    if (status === value) {
      const { status: _, ...newQuery } = query;
      void router.push({ query: newQuery });
    } else {
      void router.push({
        query: { ...query, status: value },
      });
    }
  };

  const handleIssueTagFilter = (e: ChangeEvent<HTMLSelectElement>) => {
    void router.push({
      query: { ...query, issue: e.target.value },
    });
  };

  const handleCancel = () => {
    void router.push({
      query: {
        ...initialQueryRef.current,
        showFilters: "false",
        shouldFocusSearch: false,
      },
    });
  };

  const handleApplyFilters = () => {
    void router.push({
      query: { ...query, showFilters: "false" },
    });
  };

  return {
    handleScopeFilter,
    handlePopularitySort,
    handleYearFilter,
    handleStatusFilter,
    handleIssueTagFilter,
    handleCancel,
    handleApplyFilters,
    searchRef,
    searchValue,
    setSearchValue,
  };
}

export { useBillFilters };
