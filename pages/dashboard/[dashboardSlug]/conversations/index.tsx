import {
  Badge,
  Box,
  Button,
  Divider,
  Layout,
  LoaderFlag,
  TextInput,
} from "components";
import {
  EmbedType,
  useConversationsByOrganizationQuery,
  useCreateConversationMutation,
  useUpsertEmbedMutation,
} from "generated";
import useOrganizationStore from "hooks/useOrganizationStore";
import { GetServerSideProps } from "next";
import nextI18nextConfig from "next-i18next.config";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { ReactNode, useState } from "react";
import { SupportedLocale } from "types/global";
import styles from "./index.module.scss";
import { Modal } from "components/Modal/Modal";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { DashboardTopNav } from "..";
import { ContentTypeNav } from "components/EmbedIndex/EmbedIndex";
import Link from "next/link";

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

  const isOpen = router.query.new === "true";

  const { register, control, handleSubmit, watch, setValue } = useForm();

  const handleCloseModal = () => {
    void router.push(
      {
        pathname: `/dashboard/[dashboardSlug]/conversations`,
        query: { dashboardSlug: router.query.dashboardSlug },
      },
      undefined,
      { shallow: true }
    );
  };

  const createConversationMutation = useCreateConversationMutation();
  const createEmbedMutation = useUpsertEmbedMutation();

  const [seedStatements, setSeedStatements] = useState<Array<string>>([]);

  const statement = watch("statement");

  const handleAddSeedComment = () => {
    setSeedStatements((prev) => [...prev, statement]);
    setValue("statement", "");
  };

  const queryClient = useQueryClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleCreateConversation = async (data: any) => {
    const { topic, description } = data;
    await createConversationMutation.mutateAsync(
      {
        input: {
          organizationId: organizationId as string,
          topic,
          description,
          seedStatements,
        },
      },
      {
        onSuccess: async (data) => {
          void queryClient.invalidateQueries({
            queryKey: useConversationsByOrganizationQuery.getKey({
              organizationId: organizationId as string,
              limit: 10,
            }),
          });
          await createEmbedMutation.mutateAsync(
            {
              input: {
                embedType: EmbedType.Conversation,
                organizationId: organizationId as string,
                name: topic,
                attributes: {
                  conversationId: data.createConversation.id,
                },
              },
            },
            {
              onSuccess: () => {
                handleCloseModal();
              },
            }
          );
        },
      }
    );
  };

  if (isLoading) return <LoaderFlag />;

  return (
    <div>
      <DashboardTopNav />
      <ContentTypeNav embedType="conversation" />
      <div className={styles.flexLeft}>
        <h2>Conversations</h2>
        <Link href={`/docs/conversations/overview`}>Info</Link>
      </div>
      <Button
        onClick={() =>
          router.push(
            {
              pathname: `/dashboard/[dashboardSlug]/conversations`,
              query: { dashboardSlug: router.query.dashboardSlug, new: true },
            },
            undefined,
            { shallow: true }
          )
        }
        label="Create New Conversation"
      />
      <Modal isOpen={isOpen} onClose={() => handleCloseModal()}>
        <form
          style={{ width: "36rem" }}
          onSubmit={handleSubmit(handleCreateConversation)}
        >
          <h2>New Conversation</h2>
          <div className={styles.flexColumn}>
            <TextInput
              name="topic"
              label="Topic"
              register={register}
              control={control}
            />
            <TextInput
              name="description"
              label="Description"
              register={register}
              control={control}
              textarea
            />
            <h3 style={{ margin: 0 }}>Add seed comments</h3>
            <div
              className={styles.statementInfo}
              style={{ color: "var(--aqua)" }}
            >
              <ul>
                <li>Present one clear, standalone idea</li>
                <li>Bring fresh insights to the discussion</li>
                <li>Be concise (140 characters max)</li>
              </ul>
            </div>
            {seedStatements.map((statement, index) => (
              <div key={index} className={styles.seedCommentBox}>
                <span>{statement}</span>
                <button
                  className={styles.removeSeedButton}
                  onClick={() =>
                    setSeedStatements((prev) =>
                      prev.filter((_, i) => i !== index)
                    )
                  }
                >
                  &times;
                </button>
              </div>
            ))}
            <TextInput
              name="statement"
              label="Statement"
              register={register}
              control={control}
              textarea
            />
            <div className={styles.flexRight}>
              <Button
                type="button"
                size="small"
                label="Add seed comment"
                onClick={handleAddSeedComment}
                width="12rem"
              />
            </div>
            <Divider />
            <Button label="Create Conversation" type="submit" />
          </div>
        </form>
      </Modal>

      <Divider />
      <div className={styles.grid2}>
        {data?.conversationsByOrganization.map((conversation) => (
          <Box key={conversation.id}>
            <h2>{conversation.topic}</h2>
            <p>{conversation.description}</p>
            <div className={styles.flexRight}>
              <Badge>{conversation.stats.totalParticipants} Participants</Badge>
              <Button
                onClick={() =>
                  window.open(`/conversations/${conversation.id}`, "_blank")
                }
                label="View"
              />
              <Button
                variant="secondary"
                label="Manage"
                onClick={() =>
                  router.push(
                    {
                      pathname: `/dashboard/[dashboardSlug]/conversations/[conversationId]/manage`,
                      query: {
                        dashboardSlug: router.query.dashboardSlug,
                        conversationId: conversation.id,
                      },
                    },
                    undefined,
                    { shallow: true }
                  )
                }
              />
            </div>
          </Box>
        ))}
      </div>
    </div>
  );
}

ConversationsIndexPage.getLayout = (page: ReactNode) => <Layout>{page}</Layout>;
