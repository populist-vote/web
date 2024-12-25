import { Badge, Box, Divider, DocsLayout } from "components";
import { GetServerSideProps } from "next";
import nextI18nextConfig from "next-i18next.config";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { ReactNode } from "react";
import { SupportedLocale } from "types/global";
import styles from "./index.module.scss";
import Link from "next/link";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { locale } = ctx;
  return {
    props: {
      title: "Populist Conversations",
      description:
        "Join the conversation on the latest political topics and bills.",
      ...ctx.query,
      ...(await serverSideTranslations(
        locale as SupportedLocale,
        ["auth", "common"],
        nextI18nextConfig
      )),
    },
  };
};

export default function DocsIndex() {
  return (
    <div>
      <h1>
        Populist{" "}
        <span
          style={{
            textTransform: "uppercase",
            color: "var(--aqua)",
            fontSize: "1.5rem",
            fontWeight: 600,
            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)",
          }}
        >
          docs
        </span>
      </h1>
      <Divider />

      <Box>
        <h2>Getting Started</h2>
        <p>
          Welcome to the Populist documentation hub! Here you'll find everything
          you need to get started with the Populist platform. Whether you're a
          developer looking to integrate our API, a candidate wanting to embed
          your profile, or an organization looking to provide high quality civic
          engagement tools to your community, we've got you covered.
        </p>
      </Box>
      <Divider />
      <div className={styles.grid3}>
        <Box>
          <div className={styles.flexLeft}>
            <h3>Conversations</h3>
            <Badge size="small" theme="green">
              New
            </Badge>
          </div>
          <p>
            Conversations are a new way to extract meaning from groups of
            individuals by surveying them in their own words.
          </p>
          <Link href="/docs/conversations/overview">Learn more</Link>
        </Box>
        <Box>
          <div className={styles.flexLeft}>
            <h3>Candidate Guides</h3>
          </div>
          <p>
            Send out questions to candidates and have their responses
            automatically compiled into an embeddable voter guide.
          </p>
          <Link href="/docs/content/candidate-guide">Learn more</Link>
        </Box>
        <Box>
          <div className={styles.flexLeft}>
            <h3>Public API</h3>
            <Badge size="small" theme="green">
              New
            </Badge>
          </div>
          <p>
            We are excited to announce the release of our public API. Our API
            that makes it easy to access, interact with, and build on millions
            of rows of thoughtfully structured government data.
          </p>
          <Link href="/docs/api/introduction">Learn more</Link>
        </Box>
        <Box>
          <div className={styles.flexLeft}>
            <h3>Live Election Results</h3>
          </div>
          <p>
            Looking to display live election results on your website? Populist
            has easy to use and customizable widgets that can be embedded on any
            website.
          </p>
          <Link href="/docs/content/race">Learn more</Link>
        </Box>
        <Box>
          <div className={styles.flexLeft}>
            <h3>Legislation Trackers</h3>
          </div>
          <p>
            Track the status of multiple bills as they move through the
            legislative process. Stay informed on the latest updates and changes
            to the bills that matter to you.
          </p>
          <Link href="/docs/content/legislation-tracker">Learn more</Link>
        </Box>
      </div>
    </div>
  );
}

DocsIndex.getLayout = (page: ReactNode) => (
  <DocsLayout currentPage="home">{page}</DocsLayout>
);
