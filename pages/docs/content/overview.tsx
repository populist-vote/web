import { GetServerSideProps } from "next";
import nextI18nextConfig from "next-i18next.config";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { ReactNode } from "react";
import { SupportedLocale } from "types/global";
import DocsLayout from "../DocsLayout/DocsLayout";

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

export default function DocsContentOverview() {
  return (
    <div>
      <h2>Populist helps you create civic content</h2>
      <h3>What is Civic Content?</h3>
      <p>
        Civic content is information that helps people understand and engage
        with their communities. It can be news, events, or discussions about
        local issues. Civic content is important because it helps people make
        informed decisions and participate in their communities.
      </p>
    </div>
  );
}

DocsContentOverview.getLayout = (page: ReactNode) => (
  <DocsLayout currentPage="content">{page}</DocsLayout>
);
