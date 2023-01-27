import { Box } from "components/Box/Box";
import { Button } from "components/Button/Button";
import { useRouter } from "next/router";
import { BillFiltersParams } from "pages/bills";
import { useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { BillFiltersDesktop } from "./BillFiltersDesktop";
import styles from "./BillSearchAndFilters.module.scss";

interface BillSearchAndFiltersProps {
  query: BillFiltersParams;
}

export function BillSearchAndFilters(props: BillSearchAndFiltersProps) {
  const router = useRouter();
  const { query } = router;
  const { search, showFilters = "false" } = query;
  const [searchValue, setSearchValue] = useState(search);
  const hasFiltersApplied =
    Object.keys(query).filter((q) => q !== "showFilters").length > 0 &&
    Object.values(query).some((value) => value !== "");
  const showFiltersParam = showFilters === "true";

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
            void router.replace("/bills", undefined, { shallow: true });
          }}
        />
      </div>
      {showFiltersParam && <BillFiltersDesktop {...props} />}
    </Box>
  );
}
