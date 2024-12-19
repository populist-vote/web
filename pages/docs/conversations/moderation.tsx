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

export default function DocsConversationsModeration() {
  return (
    <div>
      <h2>Moderation</h2>
      <p>
        The conversation owner controls moderation through the admin interface.
        Each new comment can be approved, rejected, or left unmoderated. While
        Conversations work without moderation, moderating effectively saves
        participants' time by removing irrelevant content.
      </p>
      <h2>Moderation Schemes</h2>
      <p>
        Strict Moderation (Default) Works like a whitelist Comments only appear
        after moderator approval. Recommended when embedding on your website to
        prevent inappropriate content. Permissive Moderation Works like a
        blacklist Comments appear immediately Can be removed later by moderators
        You can switch between these in the conversation's admin configuration.
      </p>
    </div>
  );
}

DocsConversationsModeration.getLayout = (page: ReactNode) => (
  <DocsLayout currentPage="conversations">{page}</DocsLayout>
);
