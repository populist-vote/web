import { Badge, Box, Button, Layout, LoaderFlag } from "components";
import { useConversationsByOrganizationQuery } from "generated";
import useOrganizationStore from "hooks/useOrganizationStore";
import { GetServerSideProps } from "next";
import nextI18nextConfig from "next-i18next.config";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { ReactNode } from "react";
import { SupportedLocale } from "types/global";
import styles from "./index.module.scss";

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

export default function ConversationsIndexPage() {
  const router = useRouter();
  const { organizationId } = useOrganizationStore();
  const { data, isLoading } = useConversationsByOrganizationQuery(
    {
      organizationId: organizationId as string,
      limit: 10,
    },
    {
      enabled: !!organizationId,
    }
  );

  if (isLoading) return <LoaderFlag />;

  return (
    <div>
      <h1>Conversations</h1>
      {data?.conversationsByOrganization.map((conversation) => (
        <Box key={conversation.id}>
          <h2>{conversation.topic}</h2>
          <p>{conversation.description}</p>
          <div className={styles.flexRight}>
            <Badge>{conversation.stats.totalParticipants} Participants</Badge>
            <Button
              onClick={() => router.push(`/conversations/${conversation.id}`)}
              label="View"
            />
            <Button
              variant="secondary"
              label="Manage"
              onClick={() =>
                router.push(`/conversations/${conversation.id}/manage`)
              }
            />
          </div>
        </Box>
      ))}
    </div>
  );
}

ConversationsIndexPage.getLayout = (page: ReactNode) => <Layout>{page}</Layout>;
