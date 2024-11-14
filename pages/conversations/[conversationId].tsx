import { Divider, Layout, LoaderFlag } from "components";
import { Conversation } from "components/Conversation/Conversation";
import { ConversationResult, useConversationByIdQuery } from "generated";
import { useRouter } from "next/router";
import { ReactNode } from "react";

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
          <h4>Conversation</h4>
          <Conversation id={conversationId as string} />
        </>
      ) : (
        <p>Conversation not found</p>
      )}
    </div>
  );
}

ConversationPage.getLayout = (page: ReactNode) => <Layout>{page}</Layout>;
