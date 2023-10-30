import { WidgetFooter } from "components/WidgetFooter/WidgetFooter";
import styles from "./QuestionWidget.module.scss";
import { TextInput } from "components/TextInput/TextInput";
import { useEmbedResizer } from "hooks/useEmbedResizer";
import {
  useEmbedByIdQuery,
  useUpsertQuestionSubmissionMutation,
} from "generated";
import { LoaderFlag } from "components/LoaderFlag/LoaderFlag";
import { Button } from "components/Button/Button";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

type QuestionWidgetForm = {
  response: string;
  name: string;
  email: string;
};

export function QuestionWidget({
  embedId,
  origin,
}: {
  embedId: string;
  origin: string;
}) {
  useEmbedResizer({ origin, embedId });
  const [isSuccess, setIsSuccess] = useState(false);
  const { data, isLoading, error } = useEmbedByIdQuery({ id: embedId });
  const embed = data?.embedById;
  const {
    register,
    watch,
    handleSubmit,
    formState: { isValid, isDirty, isSubmitting },
  } = useForm<QuestionWidgetForm>();
  const upsertQuestionSubmissionMutation =
    useUpsertQuestionSubmissionMutation();
  const queryClient = useQueryClient();
  const prompt = data?.embedById?.question?.prompt;
  const placeholder =
    data?.embedById?.question?.responsePlaceholderText ||
    "Enter your response here";
  const charLimit = data?.embedById?.question?.responseCharLimit || undefined;
  const questionId = data?.embedById?.question?.id;
  const allowAnonymousResponses =
    data?.embedById?.question?.allowAnonymousResponses;

  const onSubmit = (data: QuestionWidgetForm) => {
    upsertQuestionSubmissionMutation.mutate(
      {
        respondentInput:
          data.name || data.email
            ? {
                name: data.name,
                email: data.email,
                organizationId: embed?.organizationId,
              }
            : null,
        questionSubmissionInput: {
          questionId,
          response: data.response,
        },
      },
      {
        onSuccess: () => {
          setIsSuccess(true);
          void queryClient.invalidateQueries(
            useEmbedByIdQuery.getKey({ id: embedId })
          );
        },
      }
    );
  };
  if (isLoading) return <LoaderFlag />;
  if (error) return <div>Something went wrong loading this question.</div>;
  if (isSuccess)
    return (
      <article className={styles.widgetContainer}>
        <main>
          <h3 className={styles.prompt}>{prompt}</h3>
          <h5 className={styles.successMessage}>
            Thank you for your response!
          </h5>
        </main>
        <WidgetFooter />
      </article>
    );

  return (
    <article className={styles.widgetContainer}>
      <main>
        <h3 className={styles.prompt}>{prompt}</h3>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextInput
            size="small"
            name="response"
            placeholder={placeholder}
            textarea
            charLimit={charLimit}
            register={register}
            rules={{
              required: true,
            }}
            watch={watch("response")}
          />
          <br />
          <TextInput
            size="small"
            name="name"
            placeholder={`Name ${allowAnonymousResponses ? "(Optional)" : ""}`}
            register={register}
            rules={{
              required: !allowAnonymousResponses,
            }}
            style={{ marginBottom: "0.5rem" }}
          />
          <TextInput
            size="small"
            name="email"
            placeholder={`Email ${allowAnonymousResponses ? "(Optional)" : ""}`}
            register={register}
            rules={{
              required: !allowAnonymousResponses,
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            }}
            typ="email"
          />
          <div className={styles.formFooter}>
            <Button
              size="small"
              variant="primary"
              label="Submit"
              type="submit"
              disabled={
                !isValid ||
                !isDirty ||
                isSubmitting ||
                upsertQuestionSubmissionMutation.isLoading
              }
            />
          </div>
        </form>
      </main>
      <WidgetFooter />
    </article>
  );
}
