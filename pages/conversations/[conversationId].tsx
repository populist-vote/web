import { Divider, Layout, LoaderFlag } from "components";
import { Conversation } from "components/Conversation/Conversation";
import { ConversationResult, useConversationByIdQuery } from "generated";
import { GetServerSideProps } from "next";
import nextI18nextConfig from "next-i18next.config";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { ReactNode } from "react";
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
  const { conversationId } = useRouter().query;

  const { data, isLoading } = useConversationByIdQuery({
    id: conversationId as string,
  });
  const conversation = data?.conversationById as ConversationResult;

  if (!conversation) return null;

  if (isLoading) {
    return <LoaderFlag />;
  }
  return (
    <div>
      {conversation ? (
        <>
          <h1>{conversation.prompt}</h1>
          <p>{conversation.description}</p>
          <Divider />
          <Conversation id={conversationId as string} />
        </>
      ) : (
        <p>Conversation not found</p>
      )}
    </div>
  );
}

ConversationPage.getLayout = (page: ReactNode) => <Layout>{page}</Layout>;
