import { splitAtDigitAndJoin } from "utils/strings";
import { getYear } from "utils/dates";
import type { BillResult } from "generated";
import styles from "./HeaderInner.module.scss";

export const HeaderInner = ({
  billTitle,
  billNumber,
  billState,
  billSession,
}: {
  billTitle: BillResult["title"];
  billNumber: BillResult["billNumber"];
  billState: BillResult["state"];
  billSession: BillResult["session"];
}) => {
  return (
    <div className={styles.headerInner}>
      <div className={styles.stateAndDate}>
        <h3>
          {billState || "U.S."} - {splitAtDigitAndJoin(billNumber)}
        </h3>
        <h3>{getYear(billSession?.startDate)}</h3>
      </div>
      <hr></hr>
      <h2>{billTitle}</h2>
    </div>
  );
};
