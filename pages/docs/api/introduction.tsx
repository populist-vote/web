import { Divider } from "components";
import { GetServerSideProps } from "next";
import nextI18nextConfig from "next-i18next.config";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { ReactNode } from "react";
import { SupportedLocale } from "types/global";
import DocsLayout from "../DocsLayout/DocsLayout";
import { CodeBlock } from "components/CodeBlock/CodeBlock";

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

export default function DocsApiIntroduction() {
  return (
    <div>
      <h1>API Reference</h1>
      <Divider />
      <h2>Introducing: The Populist public API</h2>
      <p>
        The Populist public API provides access to the Populist platform's
        features and data. You can use the API to consume data about elections,
        politicians, bills and more.
      </p>
      <h3>GraphQL</h3>
      <p>
        The Populist public API is built on GraphQL, a query language for your
        API. You can use GraphQL to query the Populist platform for the specific
        data you need.
      </p>
      <p>A query to the Populist API could looks something like this:</p>
      <CodeBlock
        code={`query {
  elections(filter: {
    state: CO
  }) {
    title
    description
    electionDate
  }
}`}
        language="graphql"
      />
    </div>
  );
}

DocsApiIntroduction.getLayout = (page: ReactNode) => (
  <DocsLayout currentPage="api">{page}</DocsLayout>
);
