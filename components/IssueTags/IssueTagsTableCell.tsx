import * as Tooltip from "@radix-ui/react-tooltip";
import { Badge } from "components/Badge/Badge";
import { IssueTagResult } from "generated";
import { getIssueTagIcon } from "utils/data";
import styles from "./IssueTags.module.scss";
import { CellContext } from "@tanstack/react-table";

export function IssueTagsTableCell<T>({
  info,
}: {
  info: CellContext<T, unknown>;
}) {
  const tags = info.getValue() as IssueTagResult[];
  return (
    <div style={{ display: "flex", gap: "0.5rem" }}>
      {tags.slice(0, 1).map((tag: IssueTagResult) => (
        <Badge key={tag.id} size="small" color="white">
          <span>{getIssueTagIcon(tag)}</span>
          <span>{tag.name}</span>
        </Badge>
      ))}
      {tags.length > 1 && (
        <Tooltip.Provider delayDuration={300}>
          <Tooltip.Root>
            <Tooltip.Trigger className={styles.TooltipTrigger}>
              <Badge size="small" color="white">
                <span>+{(info.getValue() as IssueTagResult[]).length - 1}</span>
              </Badge>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content className={styles.TooltipContent} sideOffset={5}>
                {tags
                  .slice(1, tags.length)
                  .map((tag) => tag.name)
                  .join(", ")}
                <Tooltip.Arrow className={styles.TooltipArrow} />
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        </Tooltip.Provider>
      )}
    </div>
  );
}
