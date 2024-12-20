import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import { navigationConfig } from "utils/navigationConfig";

interface SearchIndexItem {
  label: string;
  href: string;
  content: string;
  tabId: string;
  tabLabel: string;
  tabColor: string;
  section: string;
  headings: { text: string; level: number }[];
}

async function readMDXContent(filePath: string): Promise<{
  content: string;
  headings: { text: string; level: number }[];
}> {
  const content = await fs.readFile(filePath, "utf-8");
  const { content: mdxContent } = matter(content);

  // Extract headings from MDX content
  const headingRegex = /^#{1,6}\s+(.+)$/gm;
  const headings: { text: string; level: number }[] = [];
  let match;

  while ((match = headingRegex.exec(mdxContent)) !== null) {
    const level = match[0].indexOf(" ");
    headings.push({
      text: match[1] as string,
      level,
    });
  }

  return {
    content: mdxContent,
    headings,
  };
}

async function buildSearchIndex() {
  const searchIndex: SearchIndexItem[] = [];
  const docsDir = path.join(process.cwd(), "pages/docs");

  // Process each tab in the navigation config
  for (const tab of navigationConfig.tabs) {
    const tabContent = navigationConfig[tab.id];

    if (tabContent?.sections) {
      for (const section of tabContent.sections) {
        for (const item of section.items) {
          // Convert href to filesystem path
          const mdxPath = path.join(
            docsDir,
            item.href.replace("/docs/", "") + ".mdx"
          );

          try {
            const { content, headings } = await readMDXContent(mdxPath);

            searchIndex.push({
              ...item,
              content,
              headings,
              tabId: tab.id,
              tabLabel: tab.label,
              tabColor: tab.color,
              section: section.title,
            });
          } catch (error) {
            console.warn(`Warning: Could not read MDX file for ${item.href}`);
          }
        }
      }
    }
  }

  // Write the search index to a JSON file
  await fs.writeFile(
    "public/search-index.json",
    JSON.stringify(searchIndex, null, 2)
  );

  console.log(`Built search index with ${searchIndex.length} pages`);
}

buildSearchIndex().catch(console.error);
