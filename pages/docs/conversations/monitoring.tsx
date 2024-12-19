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

export default function DocsConversationsMonitoring() {
  return (
    <div>
      <h2>Monitoring</h2>
      <p>
        You can monitor a live conversation in real time using a conversations
        "Manage" page. Here you can see the number of participants, votes,
        statements, and more.
      </p>
    </div>
  );
}

DocsConversationsMonitoring.getLayout = (page: ReactNode) => (
  <DocsLayout currentPage="conversations">{page}</DocsLayout>
);
