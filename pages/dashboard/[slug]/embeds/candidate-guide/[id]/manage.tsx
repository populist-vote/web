import { Button, Layout, TextInput } from "components";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { ReactNode, useCallback, useMemo, useState } from "react";
import { SupportedLocale } from "types/global";
import { DashboardTopNav } from "../../..";
import nextI18nextConfig from "next-i18next.config";
import { useRouter } from "next/router";
import {
  EmbedType,
  useEmbedByIdQuery,
  QuestionResult,
  useDeleteQuestionMutation,
} from "generated";

import { Box } from "components/Box/Box";
import styles from "components/EmbedIndex/EmbedIndex.module.scss";
import { EmbedHeader } from "components/EmbedHeader/EmbedHeader";
import { EmbedPageTabs } from "components/EmbedPageTabs/EmbedPageTabs";
import { Modal } from "components/Modal/Modal";
import { QuestionEmbedForm } from "../../question/new";
import clsx from "clsx";
import { ColumnDef } from "@tanstack/react-table";
import { Table } from "components/Table/Table";
import { useQueryClient } from "@tanstack/react-query";

export async function getServerSideProps({
  query,
  locale,
}: {
  query: { slug: string };
  locale: SupportedLocale;
}) {
  return {
    props: {
      slug: query.slug,
      ...(await serverSideTranslations(
        locale,
        ["auth", "common"],
        nextI18nextConfig
      )),
    },
  };
}

export default function CandidateGuideEmbedManagePage() {
  const router = useRouter();
  const { id } = router.query as { slug: string; id: string };
  const { data, isLoading: embedLoading } = useEmbedByIdQuery({ id });
  const candidateGuide = data?.embedById.candidateGuide;

  const questions = candidateGuide?.questions;
  const queryClient = useQueryClient();
  const deleteQuestionMutation = useDeleteQuestionMutation();

  const handleDeleteQuestion = useCallback(
    async (questionId: string) => {
      await deleteQuestionMutation.mutateAsync({ id: questionId });
      void queryClient.invalidateQueries({
        queryKey: useEmbedByIdQuery.getKey({ id }),
      });
    },
    [deleteQuestionMutation, id, queryClient]
  );

  const questionColumns = useMemo<ColumnDef<QuestionResult>[]>(
    () => [
      {
        header: "Prompt",
        accessorKey: "prompt",
      },
      {
        header: "Actions",
        cell: (info) => {
          return (
            <div className={styles.actions}>
              <Button
                theme="blue"
                variant="secondary"
                size="small"
                label="Edit"
                onClick={() =>
                  router.push(
                    `/dashboard/${id}/embeds/candidate-guide/${id}/manage?isQuestionFormOpen=true&questionId=${info.row.original.id}`
                  )
                }
              />
              <Button
                theme="blue"
                variant="secondary"
                size="small"
                label="Delete"
                onClick={() => handleDeleteQuestion(info.row.original.id)}
              />
            </div>
          );
        },
      },
    ],
    [handleDeleteQuestion]
  );

  const isQuestionFormOpen =
    router.query.isQuestionFormOpen === "true" || false;
  const [isModalOpen, setIsModalOpen] = useState(isQuestionFormOpen);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleNewQuestionSuccess = () => {
    void queryClient.invalidateQueries({
      queryKey: useEmbedByIdQuery.getKey({ id }),
    });
    closeModal();
  };

  return (
    <>
      <EmbedHeader title="Untitled" embedType={EmbedType.CandidateGuide} />
      <EmbedPageTabs
        embedType={EmbedType.CandidateGuide}
        selectedTab="Manage"
      />
      <div className={styles.sections}>
        <section>
          <h3>Configuration</h3>
          <Box>
            <TextInput
              name="name"
              label="Name"
              placeholder="Untitled"
              size="small"
            />
          </Box>
        </section>
        <section>
          <div className={clsx(styles.flexBetween, styles.inlineHeading)}>
            <h3>Questions</h3>
            <Button
              theme="blue"
              variant="primary"
              size="small"
              label="Add Question"
              onClick={openModal}
            />
            <Modal isOpen={isModalOpen} onClose={closeModal}>
              <h2>Add Question</h2>
              <QuestionEmbedForm
                buttonLabel="Add Question"
                candidateGuideId={candidateGuide?.id as string}
                onSuccess={handleNewQuestionSuccess}
              />
            </Modal>
          </div>

          <Table
            // @ts-expect-error Typing react table isn't easy, everything working fine here
            columns={questionColumns}
            initialState={{}}
            data={questions || []}
            theme={"blue"}
          />

          {!embedLoading && !questions?.length && (
            <Box>
              <small className={styles.noResults}>No Questions</small>
            </Box>
          )}
        </section>
        <section>
          <div className={clsx(styles.flexBetween, styles.inlineHeading)}>
            <h3>Races</h3>
            <Button
              theme="blue"
              variant="primary"
              size="small"
              label="Add Race"
            />
          </div>
          <Box>
            <span className={styles.noResults}>No Races</span>
          </Box>
        </section>
      </div>
      <div className={styles.flexBetween}></div>
    </>
  );
}

CandidateGuideEmbedManagePage.getLayout = (page: ReactNode) => (
  <Layout>
    <DashboardTopNav />
    {page}
  </Layout>
);
