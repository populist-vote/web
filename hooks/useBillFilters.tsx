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
      void router.push({ query: { ...newQuery, scope } }, undefined, {
        scroll: false,
      });
    } else {
      void router.push({ query: { ...query, scope } }, undefined, {
        scroll: false,
      });
    }
  };

  const handlePopularitySort = (value: PopularitySort) => {
    if (popularity === value) {
      const { popularity: _, ...newQuery } = query;
      void router.push({ query: newQuery }, undefined, {
        scroll: false,
      });
    } else {
      void router.push(
        {
          query: { ...query, popularity: value },
        },
        undefined,
        {
          scroll: false,
        }
      );
    }
  };

  const handleYearFilter = (e: ChangeEvent<HTMLSelectElement>) => {
    void router.push(
      {
        query: { ...query, year: e.target.value },
      },
      undefined,
      {
        scroll: false,
      }
    );
  };

  const handleStatusFilter = (value: BillStatus) => {
    if (status === value) {
      const { status: _, ...newQuery } = query;
      void router.push({ query: newQuery }, undefined, {
        scroll: false,
      });
    } else {
      void router.push(
        {
          query: { ...query, status: value },
        },
        undefined,
        {
          scroll: false,
        }
      );
    }
  };

  const handleIssueTagFilter = (e: ChangeEvent<HTMLSelectElement>) => {
    void router.push(
      {
        query: { ...query, issue: e.target.value },
      },
      undefined,
      {
        scroll: false,
      }
    );
  };

  const handleCancel = () => {
    void router.push(
      {
        query: {
          ...initialQueryRef.current,
          showFilters: "false",
          shouldFocusSearch: false,
        },
      },
      undefined,
      {
        scroll: false,
      }
    );
  };

  const handleApplyFilters = () => {
    void router.push(
      {
        query: { ...query, showFilters: "false" },
      },
      undefined,
      {
        scroll: false,
      }
    );
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
