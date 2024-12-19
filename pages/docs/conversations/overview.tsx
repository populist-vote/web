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

export default function DocsConversationsOverview() {
  return (
    <div>
      <h2>What is a Conversation?</h2>
      <p>
        Populist's <strong>Conversations</strong> is an open-source platform
        that helps large groups share and understand their collective views. It
        is an implementation of a{" "}
        <a href="https://en.wikipedia.org/wiki/Wiki_survey">Wikisurvey</a> and
        inspired by other platforms including{" "}
        <a href="https://pol.is">Pol.is</a> with a few key improvements.
      </p>
      <p>
        When using Populist conversations, people write short comments and then
        vote on other people's comments by selecting support, oppose, or
        neutral. The system shows comments to voters in a semi-random way to
        ensure broad exposure of ideas.
      </p>
      <p>
        What makes this different from regular surveys:
        <ul>
          <li>
            Participants create the content themselves instead of answering
            preset questions
          </li>
          <li>
            People can contribute meaningfully without having to vote on
            everything
          </li>
          <li>
            The system works efficiently even with hundreds, thousands, or
            potentially millions of participants
          </li>
        </ul>
      </p>
      <h4>Participating in Conversations</h4>
      <p>
        Browse through the list of existing conversations to find topics that
        interest you. Click on a conversation to view the discussion and
        contribute your thoughts and opinions.
      </p>
      <h4>Managing Conversations</h4>
      <p>
        Organization administrators have the ability to manage conversations,
        including editing or deleting conversations as needed. This ensures that
        discussions remain relevant and appropriate for the organization.
      </p>
    </div>
  );
}

DocsConversationsOverview.getLayout = (page: ReactNode) => (
  <DocsLayout currentPage="conversations">{page}</DocsLayout>
);
