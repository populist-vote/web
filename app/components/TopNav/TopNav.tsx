import clsx from "clsx";
import { Select } from "components/Select/Select";
import { PoliticalScope } from "graphql-codegen/generated";
import { useRouter } from "next/router";
import styles from "./TopNav.module.scss";

function TopNav() {
  const router = useRouter();
  const { query } = router;
  const { scope = "state", state } = query;

  const handleScopeFilter = (scope: PoliticalScope) => {
    if (scope === PoliticalScope.Federal) {
      const { state: _, ...newQuery } = query;
      void router.push({ query: { ...newQuery, scope } });
    } else {
      void router.push({ query: { ...query, scope } });
    }
  };

  return (
    <nav className={styles.container}>
      <li className={scope !== PoliticalScope.Federal ? styles.selected : ""}>
        <Select
          onChange={(e) => {
            if (e.target.value === "all") {
              const { state: _, ...newQuery } = query;
              void router.push({ query: newQuery });
            } else {
              void router.push({
                query: {
                  ...query,
                  state: e.target.value,
                  scope: PoliticalScope.State,
                },
              });
            }
          }}
          value={state as string}
          options={[
            {
              value: "CO",
              label: "Colorado",
            },
            {
              value: "MN",
              label: "Minnesota",
            },
          ]}
          accentColor="yellow"
          uppercase
        />
      </li>
      <li
        className={
          scope === PoliticalScope.Federal
            ? clsx(styles.selected, styles.aqua)
            : ""
        }
      >
        <button onClick={() => handleScopeFilter(PoliticalScope.Federal)}>
          Federal
        </button>
      </li>
    </nav>
  );
}

export { TopNav };
