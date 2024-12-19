import { Divider } from "components";

import { GetServerSideProps } from "next";
import nextI18nextConfig from "next-i18next.config";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { ReactNode } from "react";
import { SupportedLocale } from "types/global";
import DocsLayout from "../DocsLayout/DocsLayout";
import { CodeBlock } from "components/CodeBlock/CodeBlock";
import styles from "../DocsLayout/DocsLayout.module.scss";

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

export default function DocsGuidesQuickStart() {
  return (
    <div>
      <h1>API Reference</h1>
      <Divider />
      <h2>Quickstart</h2>
      <p>
        Making a request to the Populist API is easy! To get started quickly,
        copy this snippet into your terminal and run it:
      </p>
      <CodeBlock
        code={`curl 'https://api.populist.us' -H 'Content-Type: application/json' -X POST -d '{"query": "query { elections(filter: { state: CO }) { title description electionDate } }"}'`}
        language="bash"
      />
      <p>
        You should get output that looks something like this:
        <pre className={styles.jsonBlock}>
          {`{
  "data": {
    "elections": [
      {
        "title": "Colorado Primaries",
        "description": "Primary races for the general election later this year on November 8, 2022.",
        "electionDate": "2022-06-28"
      },
      {
        "title": "General Election",
        "description": "During this midterm election year, all 435 seats in the U.S. House of Representatives and 35 of the 100 seats in the U.S. Senate will be contested. This will be the first election affected by the redistricting following the 2020 census.",
        "electionDate": "2022-11-08"
      },
      {
        "title": "Municipal General Election",
        "description": "",
        "electionDate": "2023-04-04"
      },
      {
        "title": "General Runoff Election",
        "description": "Michael Johnston defeated Kelly Brough in the general runoff election for Mayor of Denver on June 6, 2023.",
        "electionDate": "2023-06-06"
      },
      {
        "title": "Primary & Special Elections",
        "description": null,
        "electionDate": "2023-08-08"
      },
      {
        "title": "General Election",
        "description": "This off-year election includes mostly local elections, with a few state level ones.",
        "electionDate": "2023-11-07"
      },
      {
        "title": "Colorado Primaries 2024",
        "description": "Primary races in Colorado for the upcoming general election on November 5, 2024",
        "electionDate": "2024-06-25"
      },
      {
        "title": "General Election 2024",
        "description": "This year's election includes the presidential election as well as all 435 seats in the U.S. House of Representatives and 33 seats in the U.S. Senate.",
        "electionDate": "2024-11-05"
      }
    ]
  }
}`}
        </pre>
      </p>
    </div>
  );
}

DocsGuidesQuickStart.getLayout = (page: ReactNode) => (
  <DocsLayout currentPage="api">{page}</DocsLayout>
);
