import fs from "fs";
import path from "path";
import { GetStaticProps, GetStaticPaths } from "next";
import BlogPost from "components/BlogPost/BlogPost";

interface BlogPostPageProps {
  markdown: string;
}

export const getStaticPaths: GetStaticPaths = async () => {
  const postsDirectory = path.join(process.cwd(), "blog");
  const fileNames = fs.readdirSync(postsDirectory);

  const paths = fileNames.map((fileName) => ({
    params: { slug: fileName.replace(/\.md$/, "") },
  }));

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<BlogPostPageProps> = async ({
  params,
}) => {
  const { slug } = params as { slug: string };
  const postFilePath = path.join(process.cwd(), "blog", `${slug}.md`);
  const postContent = fs.readFileSync(postFilePath, "utf-8");
  const meta = postContent.split("---")[1];
  const { title } = meta?.split("\n").reduce((acc, line) => {
    const [key, value] = line.split(": ");
    return { ...acc, [key as string]: value };
  }, {}) as { title: string; date: string };

  return {
    props: {
      markdown: postContent,
      title,
    },
  };
};

const BlogPostPage: React.FC<BlogPostPageProps> = ({ markdown }) => {
  return (
    <div>
      <BlogPost markdown={markdown} />
    </div>
  );
};

export default BlogPostPage;
