import {
  Badge,
  Button,
  Divider,
  LoaderFlag,
  Select,
  TextInput,
} from "components";
import { useRouter } from "next/router";
import {
  QuestionResult,
  useIssueTagsQuery,
  useQuestionByIdQuery,
  useUpsertQuestionMutation,
} from "generated";
import { toast } from "react-toastify";
import { Checkbox } from "components/Checkbox/Checkbox";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { BsXCircleFill } from "react-icons/bs";

type QuestionForm = {
  prompt: string;
  enforceCharLimit?: boolean;
  responseCharLimit?: number | null;
  responsePlaceholderText?: string | null;
  allowAnonymousResponses?: boolean;
  issueTagsIds: string[];
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
  const { data, isLoading } = useIssueTagsQuery();

  const labelOptions = data?.allIssueTags;
  const existingLabels = question?.issueTags.map((issue) => ({
    id: issue.id,
    label: issue.name,
  }));
  const [selectedLabels, setSelectedLabels] = useState<
    {
      id: string;
      label: string;
    }[]
  >(existingLabels || []);

  const optionsObject: { label: string; value: string }[] = [
    { label: "Select a Tag", value: "default" },
  ];

  labelOptions?.map((label: { name: string; id: string }) =>
    optionsObject.push({ label: label.name, value: label.id })
  );

  const {
    register,
    control,
    handleSubmit,
    watch,
    getValues,
    setValue,
    formState: { isValid, isDirty, isSubmitting },
  } = useForm<QuestionForm>({
    mode: "onChange",
    defaultValues: {
      prompt: question?.prompt,
      enforceCharLimit: !!question?.responseCharLimit,
      responseCharLimit: question?.responseCharLimit || 140,
      responsePlaceholderText: question?.responsePlaceholderText || "",
      allowAnonymousResponses: question?.allowAnonymousResponses || false,
      issueTagsIds: selectedLabels.map((label) => label.id),
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
          issueTagIds: selectedLabels.map((label) => label.id),
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

  const handleLabelSelect = (id: string) => {
    const selectedLabel = optionsObject.find((option) => option.value === id)!;
    if (
      selectedLabel.value !== "default" &&
      !selectedLabels.find((label) => label.id === selectedLabel.value)
    ) {
      setSelectedLabels((previous) => {
        const updatedLabels = [
          ...previous,
          {
            id: selectedLabel.value,
            label: selectedLabel.label,
          },
        ];

        setValue(
          "issueTagsIds",
          updatedLabels.map((label) => label.id),
          {
            shouldDirty: true,
          }
        );

        return updatedLabels;
      });
    }
  };

  const handleRemoveTag = (id: string) => () => {
    setSelectedLabels(() => {
      const updatedLabels = selectedLabels.filter((label) => label.id !== id);

      setValue(
        "issueTagsIds",
        updatedLabels.map((label) => label.id),
        {
          shouldDirty: true,
        }
      );

      return updatedLabels;
    });
  };

  const values = getValues();

  if (isLoading) return <LoaderFlag />;

  return (
    <form onSubmit={handleSubmit(handleCreateEmbed)} style={{ width: "36rem" }}>
      <h2>{!!question ? "Update" : "Add"} Question</h2>
      <pre>{JSON.stringify({ values, isDirty }, null, 4)}</pre>
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
            control={control}
            rules={{
              required: "Prompt is required",
            }}
          />
        </section>
        <section>
          <h4>Question Tags</h4>
          <Select
            backgroundColor="blue"
            value={
              selectedLabels.length > 0
                ? selectedLabels[selectedLabels.length - 1]!.id
                : "default"
            }
            options={optionsObject}
            onChange={(e) => handleLabelSelect(e.target.value)}
          />
        </section>
        <section
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "1rem",
            padding: "1rem 0",
          }}
        >
          {selectedLabels.map((label) => (
            <Badge key={label.id}>
              {label.label}
              <BsXCircleFill
                color="var(--grey)"
                onClick={handleRemoveTag(label.id)}
              />
            </Badge>
          ))}
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
                    control={control}
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
              control={control}
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
