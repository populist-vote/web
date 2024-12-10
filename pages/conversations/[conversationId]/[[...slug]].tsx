// pages/conversations/[conversationId]/[[...slug]].tsx
import { Layout, LoaderFlag, Logo, TopNav } from "components";
import { Conversation } from "components/Conversation/Conversation";
import { ConversationResult, useConversationByIdQuery } from "generated";
import { GetServerSideProps } from "next";
import nextI18nextConfig from "next-i18next.config";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactNode } from "react";
import { BsChatDots } from "react-icons/bs";
import { GiBrain } from "react-icons/gi";
import { SupportedLocale } from "types/global";

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

export default function ConversationPage() {
  const router = useRouter();
  const { conversationId, slug } = router.query;

  const { data, isLoading } = useConversationByIdQuery({
    id: conversationId as string,
  });

  const conversation = data?.conversationById as ConversationResult;
  const viewMode = slug?.[0] === "insights" ? "insights" : "participate";

  if (!conversation) return null;

  if (isLoading) {
    return <LoaderFlag />;
  }

  return conversation ? (
    <div>
      <TopNav>
        <ul>
          <Link style={{ width: "5rem" }} href="/home">
            <Logo height={65} />
          </Link>
          <li data-selected={!slug?.length} data-color={"yellow"}>
            <Link href={`/conversations/${conversationId}`}>
              <BsChatDots /> Participate
            </Link>
          </li>
          <li data-selected={slug?.[0] === "insights"} data-color={"yellow"}>
            <Link href={`/conversations/${conversationId}/insights`}>
              <GiBrain /> Insights
            </Link>
          </li>
        </ul>
      </TopNav>
      <Conversation id={conversationId as string} viewMode={viewMode} />
    </div>
  ) : (
    <p>Conversation not found</p>
  );
}

ConversationPage.getLayout = (page: ReactNode) => (
  <Layout hideNav>{page}</Layout>
);
