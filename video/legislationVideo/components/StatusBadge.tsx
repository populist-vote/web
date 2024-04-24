import React from "react";
import { Badge } from "components/Badge/Badge";
import { FaCircle } from "react-icons/fa";
import { titleCase } from "utils/strings";
import { getStatusInfo } from "utils/bill";
import type { BillStatus } from "generated";
import styles from "../LegislationVideo.module.scss";

const StatusBadge = ({ status }: { status: BillStatus }) => {
  const statusInfo = getStatusInfo(status);
  const formattedStatus = titleCase(status?.replaceAll("_", " ") ?? "");
  const badgeColor = `var(--${statusInfo?.color})`;

  return (
    <div className={styles.bottomContainer}>
      <Badge
        iconLeft={<FaCircle size={24} color={badgeColor} />}
        theme={statusInfo?.color}
        lightBackground={false}
        size="extra-large"
      >
        &nbsp;{formattedStatus}
      </Badge>
    </div>
  );
};

export default StatusBadge;
