import { IssueTagResult } from "generated";
import styles from "./IssueTags.module.scss";

interface IssueTagProps extends Partial<IssueTagResult> {
  selected?: boolean;
}

const IssueTag = ({ name }: IssueTagProps) => (
  <li className={styles.issueBubble}>{name}</li>
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

// const IssueTagList = ({
//   tags, // selected,
// }: {
//   tags: Partial<IssueTagResult>[];
//   // selected?: string;
// }) => {
//   // const { current, setCurrent } = useState(0);

//   return (
//     <ul className={styles.container}>
//       {tags.map((i) => (
//         <IssueTag key={i.id} name={i.name} />
//       ))}
//     </ul>
//   );
// };

export { IssueTags };
