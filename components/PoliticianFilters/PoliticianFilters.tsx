import { AiFillCaretDown, AiOutlineSearch } from "react-icons/ai";
import { Spacer } from "components";
import styles from "components/Layout/Layout.module.scss";
import { Chambers, PoliticalScope, State } from "../../generated";
import clsx from "clsx";
import { useRouter } from "next/router";
import { PoliticianIndexProps } from "pages/politicians";
import { ChangeEvent, useState } from "react";

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
    <div className={styles.filtersContainer}>
      <div className={styles.flexLeft}>
        <select
          className={styles.pillSelect}
          name="state"
          onChange={(e) => {
            if (e.target.value === "all") {
              const { state: _, ...newQuery } = query;
              void router.push({ query: newQuery });
            } else {
              void router.push({
                query: { ...query, state: e.target.value },
              });
            }
          }}
          value={state || "all"}
        >
          <option value={"all"}>All states</option>
          <option value={State.Co}>Colorado</option>
          <option value={State.Mn}>Minnesota</option>
        </select>
        <AiFillCaretDown className={styles.chevron} />
      </div>
      <br />
      <h2 className={styles.desktopOnly}>Browse</h2>
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
      <Spacer size={16} axis="vertical" />
      <form className={styles.flexBetween}>
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
        <div className={styles.flexLeft}>
          <select
            className={styles.pillSelect}
            name="chambers"
            onChange={handleChamberSelect}
            value={chamber || Chambers.All}
          >
            <option value={Chambers.All}>All Chambers</option>
            <option value={Chambers.House}>House</option>
            <option value={Chambers.Senate}>Senate</option>
          </select>
          <AiFillCaretDown className={styles.chevron} />
        </div>
      </form>
    </div>
  );
}

export { PoliticianIndexFilters };
