import React from "react";
import { splitAtDigitAndJoin } from "../../../../utils/strings";
import type { BillResult } from "generated";
import styles from "./HeaderInner.module.scss";
import StatusBadge from "../../components/StatusBadge";

interface HeaderInnerProps {
  headerProps: Pick<
    BillResult,
    "title" | "billNumber" | "state" | "session" | "status"
  >;
}

const HeaderInner: React.FC<HeaderInnerProps> = ({ headerProps }) => {
  const { title, billNumber, state, status } = headerProps;

  return (
    <div className={styles.headerInner}>
      <header className={styles.headerInner}>
        <div className={styles.topContainer}>
          <StatusBadge status={status} />
        </div>
        <div className={styles.middleContainer}>
          <hr />
        </div>
        <div className={styles.bottomContainer}>
          <h3>
            {state || "U.S."} -{" "}
            {billNumber ? splitAtDigitAndJoin(billNumber) : ""}
          </h3>
          <h2>{title}</h2>
        </div>
      </header>
    </div>
  );
};

export default HeaderInner;
