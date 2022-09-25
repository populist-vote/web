import { AiFillCaretDown, AiOutlineSearch } from "react-icons/ai";
import { Spacer } from "components";
import styles from "components/Layout/Layout.module.scss";
import { Chambers, PoliticalScope, State } from "../../generated";
import classNames from "classnames";
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

  const handleScopeChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.checked) {
      const { scope: _, ...newQuery } = query;
      void router.push({ query: newQuery });
    }
    const scope = e.target.value as PoliticalScope;
    void router.push({ query: { ...query, scope } });
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
          onChange={(e) =>
            void router.push({
              query: { ...query, state: e.target.value },
            })
          }
          value={state as State}
        >
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
      <form className={`${styles.flexBetween}`}>
        <input
          name="scope"
          id="federal-radio"
          type="radio"
          value={PoliticalScope.Federal}
          checked={scope === PoliticalScope.Federal}
          onChange={handleScopeChange}
        />
        <label
          htmlFor="federal-radio"
          className={classNames(styles.radioLabel, styles.aquaLabel)}
        >
          Federal
        </label>
        <input
          name="scope"
          id="state-radio"
          type="radio"
          value={PoliticalScope.State}
          checked={scope === PoliticalScope.State}
          onChange={handleScopeChange}
        />
        <label
          htmlFor="state-radio"
          className={classNames(styles.radioLabel, styles.yellowLabel)}
        >
          State
        </label>
        <input
          name="scope"
          id="local-radio"
          type="radio"
          value={PoliticalScope.Local}
          checked={scope === PoliticalScope.Local}
          onChange={handleScopeChange}
        />
        <label
          htmlFor="local-radio"
          className={classNames(styles.radioLabel, styles.salmonLabel)}
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
