import fs from "fs";
import path from "path";
import { GetStaticPaths } from "next";
import BlogPost from "components/BlogPost/BlogPost";
import nextI18nextConfig from "next-i18next.config";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { SupportedLocale } from "types/global";

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

export const getStaticProps = async ({
  params,
  locale,
}: {
  params: { slug: string };
  locale: SupportedLocale;
}) => {
  const { slug } = params as { slug: string };
  const postFilePath = path.join(process.cwd(), "blog", `${slug}.md`);
  const postContent = fs.readFileSync(postFilePath, "utf-8");
  const meta = postContent.split("---")[1];
  const { title, description } = meta?.split("\n").reduce((acc, line) => {
    const [key, value] = line.split(": ");
    return { ...acc, [key as string]: value };
  }, {}) as { title: string; date: string; description: string };

  return {
    props: {
      markdown: postContent,
      title,
      description,
      ...(await serverSideTranslations(
        locale,
        ["auth", "common"],
        nextI18nextConfig
      )),
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
