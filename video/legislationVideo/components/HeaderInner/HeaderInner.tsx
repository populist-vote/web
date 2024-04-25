import React from "react";
import { splitAtDigitAndJoin } from "utils/strings";
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
      <div className={styles.top}>
        <StatusBadge status={status} />
      </div>
      <div className={styles.middle}>
        <hr />
      </div>
      <div className={styles.bottom}>
        <h3>
          {state || "U.S."} - {splitAtDigitAndJoin(billNumber)}
        </h3>
        <h2>{title}</h2>
      </div>
    </div>
  );
};

export default HeaderInner;
