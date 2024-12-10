import { Layout, LoaderFlag } from "components";
import { ConversationResult, useConversationByIdQuery } from "generated";
import { GetServerSideProps } from "next";
import nextI18nextConfig from "next-i18next.config";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { ReactNode } from "react";
import { SupportedLocale } from "types/global";
import { DashboardTopNav } from "../..";
import { EmbedHeader } from "components/EmbedHeader/EmbedHeader";
import { ConversationViewSwitcher } from "./manage";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const locale = ctx.locale as SupportedLocale;
  return {
    props: {
      ...(await serverSideTranslations(
        locale,
        ["auth", "common"],
        nextI18nextConfig
      )),
    },
  };
};

export default function ConversationModeratePage() {
  const router = useRouter();
  const { id } = router.query;

  const { data, isLoading } = useConversationByIdQuery({
    id: id as string,
  });

  const conversation = data?.conversationById as ConversationResult;

  if (!conversation) return null;

  if (isLoading) {
    return <LoaderFlag />;
  }

  return (
    <div>
      <DashboardTopNav />
      <EmbedHeader title={conversation.topic} embedType="conversations" />
      <ConversationViewSwitcher
        currentView="moderate"
        conversationId={id as string}
      />
      {/* Statement filter - unmoderated - accepted - rejected - seed */}
      {/*  Add seed statement button */}
      {/* Search statements + Filter "Most recent" */}
      {/* Mapping of statements with votes, accept + reject */}
    </div>
  );
}

ConversationModeratePage.getLayout = (page: ReactNode) => (
  <Layout>{page}</Layout>
);
