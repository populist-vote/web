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

export default function DocsConversationsConfiguration() {
  return (
    <div>
      <h2>Configuring a Conversation</h2>
      <p>
        The conversation owner can configure the conversation settings to suit
        their needs. The following settings are available:
      </p>
      <h4>Conversation Title</h4>
      <p>
        The title of the conversation is displayed at the top of the
        conversation page. Choose a title that is descriptive and engaging to
        attract participants.
      </p>
      <h4>Conversation Description</h4>
      <p>
        The description provides additional context for the conversation. Use
        the description to explain the purpose of the conversation and provide
        guidelines for participants.
      </p>
      <h4>Seed Statements</h4>
      <p>
        Seed statements are initial statements or questions that provide context
        for the conversation. Add seed statements to prompt participants to
        engage with the conversation.
      </p>
    </div>
  );
}

DocsConversationsConfiguration.getLayout = (page: ReactNode) => (
  <DocsLayout currentPage="conversations">{page}</DocsLayout>
);
