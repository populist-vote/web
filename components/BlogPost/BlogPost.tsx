// components/BlogPost.tsx
import React from "react";
import { remark } from "remark";
import html from "remark-html";
import grayMatter from "gray-matter";
import { BasicLayout } from "components/BasicLayout/BasicLayout";
import { FlagSection } from "components";
import styles from "./BlogPost.module.scss";

interface BlogPostProps {
  markdown: string;
}

const BlogPost: React.FC<BlogPostProps> = ({ markdown }) => {
  const { data, content } = grayMatter(markdown);

  // Convert the date string to a Date object
  const postDate = new Date(data.date);

  const formattedDate = postDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const processedContent = remark().use(html).processSync(content).toString();

  return (
    <div className={styles.container}>
      <BasicLayout hideTextMenu={false}>
        <div className={styles.contentContainer}>
          <FlagSection label={formattedDate} hideFlagForMobile={true}>
            <div className={styles.content}>
              <h1>{data.title}</h1>
              {/* You can display other metadata fields here if needed */}
              <div dangerouslySetInnerHTML={{ __html: processedContent }} />
            </div>
          </FlagSection>
        </div>
      </BasicLayout>
    </div>
  );
};

export default BlogPost;
