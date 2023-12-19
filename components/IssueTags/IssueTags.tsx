import { IssueTagResult } from "generated";
import styles from "./IssueTags.module.scss";
import { getIssueTagIcon } from "utils/data";

const IssueTag = ({ tag }: { tag: IssueTagResult }) => (
  <li className={styles.issueBubble}>
    <span style={{ marginRight: "0.5rem" }}>{getIssueTagIcon(tag)}</span>
    {tag.name}
  </li>
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
