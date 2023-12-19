import { Badge } from "components/Badge/Badge";
import { BillStatus } from "generated";
import { FaCircle } from "react-icons/fa";
import { getStatusInfo } from "utils/bill";
import { titleCase } from "utils/strings";

function BillStatusBadge({ status }: { status: BillStatus }) {
  const statusInfo = getStatusInfo(status);
  return (
    <Badge
      size="small"
      iconLeft={<FaCircle size={12} color={`var(--${statusInfo?.color})`} />}
      theme={statusInfo?.color}
    >
      <span>{titleCase(status.replaceAll("_", " ") as string)}</span>
    </Badge>
  );
}

export { BillStatusBadge };
