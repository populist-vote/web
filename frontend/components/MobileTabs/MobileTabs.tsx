import clsx from "clsx";
import { Select } from "components/Select/Select";
import { PoliticalScope, State } from "generated";
import { useRouter } from "next/router";
import styles from "./MobileTabs.module.scss";

interface MobileTabsProps {
  value: PoliticalScope;
  handleChange: (value: PoliticalScope) => void;
}

function MobileTabs({ value, handleChange }: MobileTabsProps) {
  const router = useRouter();
  const { query } = router;
  const { state } = query;
  return (
    <div className={styles.container}>
      <button
        className={
          value === PoliticalScope.Federal
            ? clsx(styles.selected, styles.aqua)
            : ""
        }
        onClick={() => handleChange(PoliticalScope.Federal)}
      >
        FEDERAL
      </button>
      <button
        className={
          value === PoliticalScope.State
            ? clsx(styles.selected, styles.yellow)
            : ""
        }
        onClick={() => handleChange(PoliticalScope.State)}
      >
        <Select
          onSelected={(value: State) => {
            void router.push({
              query: {
                ...query,
                state: value,
                scope: PoliticalScope.State,
              },
            });
          }}
          onChange={(e) => {
            void router.push({
              query: {
                ...query,
                state: e.target.value,
                scope: PoliticalScope.State,
              },
            });
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
      </button>
    </div>
  );
}

export { MobileTabs };
