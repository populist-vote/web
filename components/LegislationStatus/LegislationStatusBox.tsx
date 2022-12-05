import { CSSProperties } from "react";
import { LegislationStatus } from "generated";
import { addAlphaToHexColor } from "utils/strings";
import useDocumentBaseStyle from "hooks/useDocumentBaseStyle";
import styles from "./LegislationStatus.module.scss";

const getStatusInfo = (status: LegislationStatus) => {
  switch (status) {
    case LegislationStatus.BecameLaw:
      return { text: "Became Law", subText: "", color: "--green" };
    case LegislationStatus.FailedHouse:
      return { text: "Failed", subText: "", color: "--red" };
    case LegislationStatus.FailedSenate:
      return { text: "Failed", subText: "", color: "--red" };
    case LegislationStatus.Introduced:
      return { text: "Introduced", subText: "", color: "--purple" };
    case LegislationStatus.PassedHouse:
      return {
        text: "Passed House",
        subText: "In Consideration",
        color: "--orange",
      };
    case LegislationStatus.PassedSenate:
      return {
        text: "Passed Senate",
        subText: "In Consideration",
        color: "--orange",
      };
    case LegislationStatus.ResolvingDifferences:
      return {
        text: "Resolving Differences",
        subText: "",
        color: "--orange",
      };
    case LegislationStatus.SentToExecutive:
      return { text: "Sent To Executive", subText: "", color: "--orange" };
    case LegislationStatus.Unknown:
      return { text: "Unknown", subText: "", color: "--grey" };
    case LegislationStatus.Vetoed:
      return { text: "Vetoed", subText: "", color: "--red" };
  }
};

interface LegislationStatusProps {
  status: LegislationStatus;
}

function LegislationStatusBox({ status }: LegislationStatusProps) {
  const statusInfo = getStatusInfo(status);
  const style = useDocumentBaseStyle();

  const styleVars: CSSProperties & {
    "--box-color": string;
    "--box-background-color": string;
  } = {
    [`--box-color`]: `var(${statusInfo.color})`,
    [`--box-background-color`]: addAlphaToHexColor(
      style.getPropertyValue(statusInfo.color),
      0.1
    ),
  };

  return (
    <div style={styleVars}>
      <div className={styles.legislationStatusContainer}>
        {statusInfo.subText && <h3>{statusInfo.subText}</h3>}
        <h1>{statusInfo.text}</h1>
      </div>
    </div>
  );
}

export { LegislationStatusBox };
