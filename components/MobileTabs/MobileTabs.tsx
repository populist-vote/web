import { PoliticalScope } from "generated";
import styles from "./MobileTabs.module.scss";

function MobileTabs({ value, handleChange }) {
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
