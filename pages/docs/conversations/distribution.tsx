import { GetServerSideProps } from "next";
import nextI18nextConfig from "next-i18next.config";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { ReactNode } from "react";
import { SupportedLocale } from "types/global";
import DocsLayout from "../DocsLayout/DocsLayout";
import { Divider } from "components";

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

export default function DocsConversationsDistribution() {
  return (
    <div>
      <h2>Distributing a Conversation</h2>
      <p>
        The conversation owner can distribute the conversation to participants
        using the following methods:
      </p>
      <h4>Direct Link</h4>
      <p>
        Share the conversation link with participants via email, social media,
        or other communication channels. Participants can access the
        conversation by clicking the link.
      </p>
      <h4>
        Embed Code <span style={{ color: "var(--salmon)" }}>(Coming Soon)</span>
      </h4>
      <p>
        Embed the conversation on your website using the provided embed code.
        Participants can engage with the conversation directly on your website.
      </p>
      <Divider />
      <h2>Marketing</h2>
      <p>
        Promote the conversation to attract participants and increase
        engagement. Consider the following marketing strategies:
      </p>
      <h4>Email list</h4>
      <p>
        Send an email to your subscribers inviting them to participate in the
        conversation. Include a brief description of the conversation and a
        call-to-action to join.
      </p>
      <h4>Social media</h4>
      <p>
        Share the conversation link on your social media channels to reach a
        wider audience. Use engaging visuals and captions to attract
        participants.
      </p>
      <h4>Paid Ads</h4>
      <p>
        Consider running paid ads to promote the conversation to a targeted
        audience. Use platforms like Google Ads or Facebook Ads to reach
        potential participants.
      </p>
    </div>
  );
}

DocsConversationsDistribution.getLayout = (page: ReactNode) => (
  <DocsLayout currentPage="conversations">{page}</DocsLayout>
);
