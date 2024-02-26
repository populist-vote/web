import { WidgetFooter } from "components/WidgetFooter/WidgetFooter";
import styles from "./PollWidget.module.scss";
import { useEmbedResizer } from "hooks/useEmbedResizer";
import { useEmbedByIdQuery, useUpsertPollSubmissionMutation } from "generated";
import { LoaderFlag } from "components/LoaderFlag/LoaderFlag";
import { Button } from "components/Button/Button";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { TextInput } from "components/TextInput/TextInput";

type PollWidgetForm = {
  selectedResponseId: string;
  writeInResponse?: string;
  name: string;
  email: string;
};

export function PollWidget({
  embedId,
  origin,
}: {
  embedId: string;
  origin: string;
}) {
  useEmbedResizer({ origin, embedId });
  const [isSuccess, setIsSuccess] = useState(false);
  const { data, isLoading, error } = useEmbedByIdQuery({ id: embedId });
  const {
    register,
    handleSubmit,
    watch,
    formState: { isValid, isDirty, isSubmitting },
  } = useForm<PollWidgetForm>();
  const embed = data?.embedById;
  const upsertPollSubmissionMutation = useUpsertPollSubmissionMutation();
  const queryClient = useQueryClient();
  const prompt = data?.embedById?.poll?.prompt;
  const pollId = data?.embedById?.poll?.id;

  const watchSelected = watch("selectedResponseId");

  const allowAnonymousResponses =
    data?.embedById?.poll?.allowAnonymousResponses;
  const allowWriteInResponses = data?.embedById?.poll?.allowWriteInResponses;

  const onSubmit = (data: PollWidgetForm) => {
    upsertPollSubmissionMutation.mutate(
      {
        respondentInput:
          data.name || data.email
            ? {
                name: data.name,
                email: data.email,
                organizationId: embed?.organizationId,
              }
            : null,
        pollSubmissionInput: {
          pollId,
          pollOptionId: data.selectedResponseId,
          writeInResponse: data.writeInResponse,
        },
      },
      {
        onSuccess: () => {
          setIsSuccess(true);
          void queryClient.invalidateQueries({
            queryKey: useEmbedByIdQuery.getKey({ id: embedId }),
          });
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
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={styles.submissionForm}
        >
          {data?.embedById.poll?.options?.map((option) => (
            <label
              className={styles.pollOption}
              key={option.optionText}
              htmlFor={option.id}
              data-selected={watchSelected === option.id}
            >
              <input
                {...register("selectedResponseId")}
                type="radio"
                value={option.id}
                id={option.id}
              />
              {option.optionText}
            </label>
          ))}
          {allowWriteInResponses && (
            <TextInput
              size="medium"
              name="writeInResponse"
              placeholder="Write-in Response"
              register={register}
            />
          )}
          <small className={styles.consent}>
            Your information will never be used without your consent.
          </small>
          <TextInput
            size="small"
            name="name"
            placeholder={`Name ${allowAnonymousResponses ? "(Optional)" : ""}`}
            register={register}
            rules={{
              required: !allowAnonymousResponses,
            }}
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
              theme="grey"
              label="Submit"
              type="submit"
              disabled={
                !isValid ||
                !isDirty ||
                isSubmitting ||
                upsertPollSubmissionMutation.isPending
              }
            />
          </div>
        </form>
      </main>
      <WidgetFooter />
    </article>
  );
}
