import { ReactNode } from "react";
import styles from "./index.module.scss";
import { Box, Layout } from "components";
import { useIssueTagsQuery } from "generated";
import { useRouter } from "next/router";

function IssuesPage() {
  const router = useRouter();
  const { data } = useIssueTagsQuery();

  return (
    <div className={styles.container}>
      <h1>Issues</h1>
      <div className={styles.issueGrid}>
        {data?.allIssueTags.map((issue) => (
          <Box
            key={issue.id}
            isLink
            onClick={() => router.push(`issues/${issue.slug}`)}
          >
            <h2 className={styles.issueTitle}>{issue.name}</h2>
            <p className={styles.issueDescription}>{issue.description}</p>
            <div className={styles.issueFooter}></div>
          </Box>
        ))}
      </div>
    </div>
  );
}

IssuesPage.getLayout = (page: ReactNode) => <Layout>{page}</Layout>;
export default IssuesPage;
