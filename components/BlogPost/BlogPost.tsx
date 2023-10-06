// components/BlogPost.tsx
import React from "react";
import { remark } from "remark";
import html from "remark-html";
import grayMatter from "gray-matter";
import { BasicLayout } from "components/BasicLayout/BasicLayout";

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
    <BasicLayout>
      <h1>{data.title}</h1>
      <p>{formattedDate}</p>
      {/* You can display other metadata fields here if needed */}
      <div dangerouslySetInnerHTML={{ __html: processedContent }} />
    </BasicLayout>
  );
};

export default BlogPost;
