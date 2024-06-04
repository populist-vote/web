import { Button, Divider, LoaderFlag, TextInput } from "components";
import { useRouter } from "next/router";
import {
  QuestionResult,
  useQuestionByIdQuery,
  useUpsertQuestionMutation,
} from "generated";
import { toast } from "react-toastify";
import { Checkbox } from "components/Checkbox/Checkbox";
import { useForm } from "react-hook-form";

type QuestionForm = {
  prompt: string;
  enforceCharLimit?: boolean;
  responseCharLimit?: number | null;
  responsePlaceholderText?: string | null;
  allowAnonymousResponses?: boolean;
};

export function QuestionForm({
  candidateGuideId,
  onSuccess,
  allowAnonymousResponsesToggle = true,
}: {
  candidateGuideId?: string;
  onSuccess?: () => void;
  allowAnonymousResponsesToggle?: boolean;
}) {
  const router = useRouter();
  const { query } = router;
  const { questionId } = query;
  const { data, isLoading } = useQuestionByIdQuery(
    {
      id: questionId as string,
    },
    {
      enabled: !!questionId,
    }
  );
  const question = data?.questionById;

  if (isLoading) return <LoaderFlag />;
  return (
    <QuestionFormInner
      question={question as QuestionResult}
      candidateGuideId={candidateGuideId}
      onSuccess={onSuccess}
      allowAnonymousResponsesToggle={allowAnonymousResponsesToggle}
    />
  );
}

function QuestionFormInner({
  question,
  allowAnonymousResponsesToggle = true,
  candidateGuideId,
  onSuccess,
}: {
  question?: QuestionResult;
  allowAnonymousResponsesToggle?: boolean;
  candidateGuideId?: string;
  onSuccess?: () => void;
}) {
  const upsertQuestion = useUpsertQuestionMutation();

  const {
    register,
    handleSubmit,
    watch,
    formState: { isValid, isDirty, isSubmitting },
  } = useForm<QuestionForm>({
    mode: "onChange",
    defaultValues: {
      prompt: question?.prompt,
      enforceCharLimit: !!question?.responseCharLimit,
      responseCharLimit: question?.responseCharLimit || 140,
      responsePlaceholderText: question?.responsePlaceholderText || "",
      allowAnonymousResponses: question?.allowAnonymousResponses || false,
    },
  });

  const watchCharacterLimit = watch("enforceCharLimit");

  const handleCreateEmbed = (data: QuestionForm) => {
    const {
      prompt,
      enforceCharLimit,
      responseCharLimit,
      responsePlaceholderText,
    } = data;

    upsertQuestion.mutate(
      {
        input: {
          id: question?.id as string,
          prompt,
          responseCharLimit:
            enforceCharLimit && responseCharLimit ? responseCharLimit : null,
          responsePlaceholderText,
          allowAnonymousResponses: data.allowAnonymousResponses || false,
          candidateGuideId,
        },
      },
      {
        onError: (error) => {
          toast(
            `Something went wrong saving this embed: ${(
              error as Error
            ).toString()}`,
            {
              type: "error",
              position: "bottom-right",
            }
          );
        },
        onSuccess: () => {
          if (onSuccess) onSuccess();
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit(handleCreateEmbed)}>
      <h2>{!!question ? "Update" : "Add"} Question</h2>
      <div
        style={{
          display: "grid",
          gridTemplateRows: "auto 1fr",
        }}
      >
        <section>
          <TextInput
            id="prompt"
            name="prompt"
            size="small"
            placeholder="What question would you like to ask?"
            register={register}
            rules={{
              required: "Prompt is required",
            }}
          />
        </section>
        <Divider />
        <section
          style={{
            display: "grid",
            gap: "1rem",
            padding: "1rem 0",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateRows: "auto auto",
              gap: "0.75rem",
            }}
          >
            {allowAnonymousResponsesToggle && (
              <Checkbox
                id="allowAnonymousResponses"
                name="allowAnonymousResponses"
                label="Allow Anonymous Responses"
                register={register}
              />
            )}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                height: "2rem",
              }}
            >
              <Checkbox
                id="enforceCharLimit"
                name="enforceCharLimit"
                label="Enforce character limit for responses"
                register={register}
              />
              {watchCharacterLimit && (
                <div style={{ width: "75px" }}>
                  <TextInput
                    size="small"
                    type="number"
                    id="responseCharLimit"
                    name="responseCharLimit"
                    register={register}
                    rules={{
                      valueAsNumber: true,
                    }}
                  />
                </div>
              )}
            </div>
            <TextInput
              id="responsePlaceholderText"
              name="responsePlaceholderText"
              label="Response Placeholder Text"
              size="small"
              placeholder="What placeholder text would you like respondents to see?"
              register={register}
            />
          </div>
        </section>
        <Divider />
        <section></section>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: "1rem",
        }}
      >
        <Button
          size="medium"
          variant="primary"
          width="fit-content"
          label={"Save"}
          type="submit"
          disabled={
            !isDirty || !isValid || isSubmitting || upsertQuestion.isPending
          }
        />
      </div>
    </form>
  );
}
