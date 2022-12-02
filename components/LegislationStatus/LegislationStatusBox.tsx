import { CSSProperties } from "react";
import { LegislationStatus } from "generated";
import styles from "./LegislationStatus.module.scss";

const getStatusInfo = (status: LegislationStatus) => {
  switch (status) {
    case LegislationStatus.BecameLaw:
      return { text: "Became Law", subText: "", color: "var(--green)" };
    case LegislationStatus.FailedHouse:
      return { text: "Failed", subText: "", color: "var(--red)" };
    case LegislationStatus.FailedSenate:
      return { text: "Failed", subText: "", color: "var(--red)" };
    case LegislationStatus.Introduced:
      return { text: "Introduced", subText: "", color: "var(--purple)" };
    case LegislationStatus.PassedHouse:
      return { text: "Passed House", subText: "", color: "var(--orange)" };
    case LegislationStatus.PassedSenate:
      return { text: "Passed Senate", subText: "", color: "var(--orange)" };
    case LegislationStatus.ResolvingDifferences:
      return {
        text: "Resolving Differences",
        subText: "",
        color: "var(--orange)",
      };
    case LegislationStatus.SentToExecutive:
      return { text: "Sent To Executive", subText: "", color: "var(--orange)" };
    case LegislationStatus.Unknown:
      return { text: "Unknown", subText: "", color: "var(--grey)" };
    case LegislationStatus.Vetoed:
      return { text: "Vetoed", subText: "", color: "var(--red)" };
  }
};

interface LegislationStatusProps {
  status: LegislationStatus;
}

function LegislationStatusBox({ status }: LegislationStatusProps) {
  const statusInfo = getStatusInfo(status);

  const styleVars: CSSProperties & {
    "--box-color": string;
  } = {
    [`--box-color`]: statusInfo.color,
  };

  return (
    <div style={styleVars}>
      <div className={styles.legislationStatusContainer}>
        <h1>{statusInfo.text}</h1>
      </div>
    </div>
  );
}

export { LegislationStatusBox };
