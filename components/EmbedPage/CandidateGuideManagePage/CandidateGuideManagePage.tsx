import { Button } from "components/Button/Button";
import styles from "./CandidateGuideManagePage.module.scss";
import { Box } from "components/Box/Box";
import { useState } from "react";
import { Modal } from "components/Modal/Modal";
import { QuestionEmbedForm } from "pages/dashboard/[slug]/embeds/question/new";
import {
  QuestionResult,
  useCandidateGuideByIdQuery,
  useEmbedByIdQuery,
} from "generated";

export function CandidateGuideManagePage({ embedId }: { embedId: string }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data, isLoading } = useEmbedByIdQuery({
    id: embedId,
  });

  const candidateGuideId = data?.embedById?.attributes
    ?.candidateGuideId as string;

  const { data: candidateGuideData } = useCandidateGuideByIdQuery(
    {
      id: candidateGuideId,
    },
    {
      enabled: !!candidateGuideId,
    }
  );

  const questions = candidateGuideData?.candidateGuideById
    ?.questions as QuestionResult[];

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  return (
    <div>
      <div className={styles.flexBetween}>
        <h3>Questions</h3>
        <Button
          variant="primary"
          size="small"
          label="Add Question"
          onClick={openModal}
        />
      </div>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <h2>Add Question</h2>
        <QuestionEmbedForm buttonLabel="Add Question" />
      </Modal>
      <Box>
        {questions?.map((question) => (
          <div key={question.id}>{question.prompt}</div>
        ))}
        {!isLoading && !questions?.length && (
          <small className={styles.noResults}>No Questions</small>
        )}
      </Box>
    </div>
  );
}
