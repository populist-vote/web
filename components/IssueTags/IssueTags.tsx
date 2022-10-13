import styles from "./IssueTags.module.scss";
import { IssueTagResult } from "generated";

const IssueTag = ({ name }: Partial<IssueTagResult>) => (
  <span className={styles.issueBubble}>{name}</span>
);

const IssueTags = ({ tags }: { tags: Partial<IssueTagResult>[] }) => {
  return (
    <div className={styles.container}>
      {tags.map((i) => (
        <IssueTag key={i.id} name={i.name} />
      ))}
    </div>
  );
};

export { IssueTags };
