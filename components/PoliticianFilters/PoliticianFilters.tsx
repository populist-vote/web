import { AiOutlineSearch } from "react-icons/ai";
import { Select } from "components";
import styles from "components/Layout/Layout.module.scss";
import { Chambers, PoliticalScope, State } from "../../generated";
import clsx from "clsx";
import { useRouter } from "next/router";
import { PoliticianIndexProps } from "pages/politicians";
import { ChangeEvent, useState } from "react";
import { Box } from "components/Box/Box";
import * as Separator from "@radix-ui/react-separator";

function PoliticianIndexFilters(props: PoliticianIndexProps) {
  const router = useRouter();
  const { query } = router;
  const {
    state = null,
    scope = null,
    chamber = null,
    search = "",
  } = props.query || query;

  const [searchValue, setSearchValue] = useState<string | null>(search || "");

  const handleScopeChange = (newScope: PoliticalScope) => {
    if (newScope === scope) {
      const { scope: _, ...newQuery } = query;
      void router.push({ query: newQuery });
    } else {
      void router.push({ query: { ...query, scope: newScope } });
    }
  };

  const handleChamberSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    const chamber = e.target.value as Chambers;
    void router.push({ query: { ...query, chamber } });
  };

  return (
    <Box>
      <div className={styles.flexBetween}>
        <Select
          backgroundColor="blue"
          value={state || "all"}
          options={[
            { value: "all", label: "All States" },
            { value: State.Co, label: "Colorado" },
            { value: State.Mn, label: "Minnesota" },
          ]}
          onChange={(e) => {
            const state = e.target.value as State;
            void router.push({ query: { ...query, state } });
          }}
        />
        <div className={styles.inputWithIcon}>
          <input
            placeholder="Search"
            onChange={(e) => {
              setSearchValue(e.target.value);
              void router.push({ query: { ...query, search: e.target.value } });
            }}
            value={searchValue || ""}
          ></input>
          <AiOutlineSearch color="var(--blue)" size={"1.25rem"} />
        </div>
      </div>
      <Separator.Root
        className={styles.SeparatorRoot}
        decorative
        style={{
          margin: "1rem 0 ",
          height: "1px",
          backgroundColor: `var(--blue-dark)`,
        }}
      />
      <div className={styles.filtersContainer}>
        <Select
          border="solid"
          accentColor="blue"
          onChange={handleChamberSelect}
          value={chamber || Chambers.All}
          options={[
            { value: Chambers.All, label: "All Chambers" },
            { value: Chambers.House, label: "House" },
            { value: Chambers.Senate, label: "Senate" },
          ]}
        />
        <input
          name="scope"
          id="federal-radio"
          type="radio"
          value={PoliticalScope.Federal}
          checked={scope === PoliticalScope.Federal}
          onClick={() => handleScopeChange(PoliticalScope.Federal)}
          onChange={() => null}
        />
        <label
          htmlFor="federal-radio"
          className={clsx(styles.radioLabel, styles.aquaLabel)}
        >
          Federal
        </label>
        <input
          name="scope"
          id="state-radio"
          type="radio"
          value={PoliticalScope.State}
          checked={scope === PoliticalScope.State}
          onClick={() => handleScopeChange(PoliticalScope.State)}
          onChange={() => null}
        />
        <label
          htmlFor="state-radio"
          className={clsx(styles.radioLabel, styles.yellowLabel)}
        >
          State
        </label>
        <input
          name="scope"
          id="local-radio"
          type="radio"
          value={PoliticalScope.Local}
          checked={scope === PoliticalScope.Local}
          onClick={() => handleScopeChange(PoliticalScope.Local)}
          onChange={() => null}
        />
        <label
          htmlFor="local-radio"
          className={clsx(styles.radioLabel, styles.salmonLabel)}
        >
          Local
        </label>
      </div>
    </Box>
  );
}

export { PoliticianIndexFilters };
