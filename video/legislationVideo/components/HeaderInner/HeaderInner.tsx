import React from "react";
import { splitAtDigitAndJoin } from "utils/strings";
import { getYear } from "utils/dates";
import type { BillResult } from "generated";
import styles from "./HeaderInner.module.scss";

interface HeaderInnerProps {
  headerProps: Pick<BillResult, "title" | "billNumber" | "state" | "session">;
}

const HeaderInner: React.FC<HeaderInnerProps> = ({ headerProps }) => {
  const { title, billNumber, state, session } = headerProps;

  return (
    <div className={styles.headerInner}>
      <div className={styles.stateAndDate}>
        <h3>
          {state || "U.S."} - {splitAtDigitAndJoin(billNumber)}
        </h3>
        <h3>
          {getYear(session?.startDate)} - {getYear(session?.endDate)}
        </h3>
      </div>
      <hr />
      <h2>{title}</h2>
    </div>
  );
};

export default HeaderInner;
