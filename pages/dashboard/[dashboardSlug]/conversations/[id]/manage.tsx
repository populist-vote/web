import { Layout, LoaderFlag, RadioGroup } from "components";
import { ConversationResult, useConversationByIdQuery } from "generated";
import { GetServerSideProps } from "next";
import nextI18nextConfig from "next-i18next.config";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { ReactNode, useEffect, useCallback } from "react";
import { SupportedLocale } from "types/global";
import { DashboardTopNav } from "../..";
import { EmbedHeader } from "components/EmbedHeader/EmbedHeader";

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

export default function ConversationManagePage() {
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
        currentView="manage"
        conversationId={id as string}
      />
      {/* States boxes */}
      {/* Participants, votes, statements */}\
      {/* Configure, add seed statement */}
      {/* Status - open + close */}
      {/* Share - copy embed code */}
    </div>
  );
}

ConversationManagePage.getLayout = (page: ReactNode) => <Layout>{page}</Layout>;

export function ConversationViewSwitcher({
  currentView,
  conversationId,
}: {
  currentView: "manage" | "moderate";
  conversationId: string;
}) {
  const router = useRouter();
  const { dashboardSlug } = router.query;

  const handleViewChange = useCallback(
    async (newView: string) => {
      const url = `/dashboard/${dashboardSlug}/conversations/${conversationId}/${newView}`;

      try {
        // Start loading the new page in the background
        await router.prefetch(url);

        // Perform the navigation with shallow routing
        await router.push(
          {
            pathname: `/dashboard/[dashboardSlug]/conversations/[id]/${newView}`,
            query: {
              dashboardSlug,
              id: conversationId,
            },
          },
          url,
          { shallow: true }
        );
      } catch (error) {
        console.error("Navigation failed:", error);
      }
    },
    [router, dashboardSlug, conversationId]
  );

  // Prefetch the alternate view on mount
  useEffect(() => {
    const alternateView = currentView === "manage" ? "moderate" : "manage";
    const url = `/dashboard/${dashboardSlug}/conversations/${conversationId}/${alternateView}`;
    void router.prefetch(url);
  }, [currentView, router, dashboardSlug, conversationId]);

  return (
    <RadioGroup
      options={["manage", "moderate"]}
      selected={currentView}
      onChange={handleViewChange}
    />
  );
}
