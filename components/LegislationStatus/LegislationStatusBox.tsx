import { CSSProperties } from "react";
import { BallotMeasureStatus, BillStatus } from "generated";
import { addAlphaToHexColor } from "utils/strings";
import useDocumentBaseStyle from "hooks/useDocumentBaseStyle";
import styles from "./LegislationStatus.module.scss";
import { getStatusInfo } from "utils/bill";

interface LegislationStatusProps {
  status: BillStatus | BallotMeasureStatus;
}

function LegislationStatusBox({ status }: LegislationStatusProps) {
  const statusInfo = getStatusInfo(status);
  const style = useDocumentBaseStyle();

  const styleVars: CSSProperties & {
    "--box-color": string;
    "--box-background-color": string;
  } = {
    [`--box-color`]: `var(${statusInfo?.color})`,
    [`--box-background-color`]: addAlphaToHexColor(
      style.getPropertyValue(statusInfo?.color as string),
      0.1
    ),
  };

  return (
    <div style={styleVars}>
      <div className={styles.legislationStatusContainer}>
        {statusInfo?.subText && <h3>{statusInfo?.subText}</h3>}
        <h1>{statusInfo?.text}</h1>
      </div>
    </div>
  );
}

export { LegislationStatusBox };
