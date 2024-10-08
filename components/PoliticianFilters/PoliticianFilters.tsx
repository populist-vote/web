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
import states from "utils/states";

function PoliticianIndexFilters(props: PoliticianIndexProps) {
  const router = useRouter();
  const { query } = router;
  const { state = null, chamber = null, search = "" } = props.query || query;

  const [searchValue, setSearchValue] = useState<string | null>(search || "");

  const handleChamberSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    const chamber = e.target.value as Chambers;
    void router.push({ query: { ...query, chamber } });
  };

  const stateOptions = Object.entries(states).map(([code, name]) => ({
    value: code,
    label: name,
  }));

  return (
    <Box>
      <div className={styles.flexBetween}>
        <Select
          backgroundColor="blue"
          value={state || "all"}
          options={[{ value: "all", label: "All States" }, ...stateOptions]}
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
        <PoliticalScopeFilters />
      </div>
    </Box>
  );
}

export function PoliticalScopeFilters() {
  const router = useRouter();
  const { query } = router;
  const { scope = null } = query;
  const handleScopeChange = (newScope: PoliticalScope) => {
    if (newScope === scope) {
      const { scope: _, ...newQuery } = query;
      void router.push({ query: newQuery }, undefined, { shallow: true });
    } else {
      void router.push({ query: { ...query, scope: newScope } }, undefined, {
        shallow: true,
      });
    }
  };
  return (
    <div className={styles.filtersContainer}>
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
  );
}

export { PoliticianIndexFilters };
