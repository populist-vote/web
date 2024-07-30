import { IssueTagResult } from "generated";
import styles from "./IssueTags.module.scss";
import { getIssueTagIcon } from "utils/data";
import { Badge } from "components/Badge/Badge";

const IssueTag = ({ tag }: { tag: IssueTagResult }) => (
  <Badge size="small">
    {!!getIssueTagIcon(tag) && (
      <span style={{ marginRight: "0.5rem", height: "fit-content" }}>
        {getIssueTagIcon(tag)}
      </span>
    )}
    {tag.name}
  </Badge>
);

const IssueTags = ({ tags }: { tags: IssueTagResult[] }) => {
  return (
    <div className={styles.container}>
      {tags.map((i) => (
        <IssueTag key={i.id} tag={i} />
      ))}
    </div>
  );
};

export { IssueTags };
