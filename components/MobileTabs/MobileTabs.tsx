import { PoliticalScope } from "generated";
import styles from "./MobileTabs.module.scss";

interface MobileTabsProps {
  value: PoliticalScope;
  handleChange: (value: PoliticalScope) => void;
}

function MobileTabs({ value, handleChange }: MobileTabsProps) {
  return (
    <div className={styles.container}>
      <button
        className={value === PoliticalScope.Federal ? styles.selected : ""}
        onClick={() => handleChange(PoliticalScope.Federal)}
      >
        Federal
      </button>
      <button
        className={value === PoliticalScope.State ? styles.selected : ""}
        onClick={() => handleChange(PoliticalScope.State)}
      >
        State
      </button>
    </div>
  );
}

export { MobileTabs };
