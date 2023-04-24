import { Box } from "components/Box/Box";
import { Button } from "components/Button/Button";
import { Select } from "components/Select/Select";
import { PoliticalScope } from "generated";
import { useAuth } from "hooks/useAuth";
import { useRouter } from "next/router";
import { useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { BillFiltersDesktop } from "./BillFiltersDesktop";
import styles from "./BillSearchAndFilters.module.scss";

export function BillSearchAndFilters() {
  const router = useRouter();
  const { query } = router;
  const { user } = useAuth({ redirect: false });
  const {
    search,
    showFilters = "false",
    state = user?.userProfile?.address?.state,
    scope,
  } = query;
  const [searchValue, setSearchValue] = useState(search);
  const hasFiltersApplied =
    Object.keys(query).filter((q) => q !== "showFilters" && q !== "slug")
      .length > 0 && Object.values(query).some((value) => value !== "");

  const showFiltersParam = showFilters === "true";

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
    router.push({
      query: { ...query, state: e.target.value },
    });

  return (
    <Box>
      <div className={styles.flex}>
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
          ></input>
          <AiOutlineSearch color="var(--blue)" size={"1.25rem"} />
        </div>
        {scope !== PoliticalScope.Federal && (
          <Select
            border="solid"
            accentColor="yellow"
            value={state as string}
            disabled={scope === "FEDERAL"}
            options={[
              { value: "CO", label: "Colorado" },
              { value: "MN", label: "Minnesota" },
            ]}
            onChange={handleStateChange}
          />
        )}
        <Button
          variant={
            showFiltersParam || hasFiltersApplied ? "primary" : "secondary"
          }
          theme="yellow"
          label="Filters"
          size="medium"
          onClick={() =>
            router.push({
              query: {
                ...query,
                showFilters: showFiltersParam ? false : true,
              },
            })
          }
        />
        <Button
          variant="secondary"
          theme={"yellow"}
          disabled={!hasFiltersApplied}
          label="Clear"
          size="medium"
          onClick={() => {
            setSearchValue("");
            const {
              search: _search,
              showFilters: _showFilters,
              state: _state,
              scope: _scope,
              status: _status,
              ...newQuery
            } = query;
            void router.replace(
              {
                pathname: router.pathname,
                query: newQuery,
              },
              undefined,
              { shallow: true }
            );
          }}
        />
      </div>
      {showFiltersParam && <BillFiltersDesktop />}
    </Box>
  );
}
