import { Button, Divider, Layout, TextInput } from "components";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { ReactNode } from "react";
import { SupportedLocale } from "types/global";
import { DashboardTopNav } from "../..";
import nextI18nextConfig from "next-i18next.config";
import { useRouter } from "next/router";
import {
  EmbedResult,
  EmbedType,
  useEmbedByIdQuery,
  useUpsertEmbedMutation,
  useUpsertQuestionMutation,
} from "generated";
import { useAuth } from "hooks/useAuth";
import { toast } from "react-toastify";
import { Box } from "components/Box/Box";
import { Checkbox } from "components/Checkbox/Checkbox";
import { useForm } from "react-hook-form";
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

type NewQuestionEmbedForm = {
  prompt: string;
  enforceCharLimit?: boolean;
  responseCharLimit?: number | null;
  responsePlaceholderText?: string | null;
  allowAnonymousResponses?: boolean;
};

export function QuestionForm({
  buttonLabel = "Save",
  questionId,
  candidateGuideId,
  onSuccess,
}: {
  buttonLabel: string;
  questionId?: string;
  candidateGuideId?: string;
  onSuccess?: () => void;
}) {
  const router = useRouter();
  const { query } = router;
  const queryClient = useQueryClient();
  const { slug } = query;
  const { user } = useAuth();
  const upsertQuestion = useUpsertQuestionMutation();

  const { data, isLoading } = useQuestionByIdQuery(
    {
      id: questionId as string,
    },
    {
      enabled: !!questionId,
    }
  );

  const {
    register,
    handleSubmit,
    watch,
    formState: { isValid, isDirty, isSubmitting },
    reset,
  } = useForm<NewQuestionEmbedForm>({
    mode: "onChange",
    defaultValues: {
      prompt: data.questionById?.prompt,
      enforceCharLimit: !!data.questionById.responseCharLimit,
      responseCharLimit: data.questionById.responseCharLimit || 140,
      responsePlaceholderText: data.questionById?.responsePlaceholderText || "",
      allowAnonymousResponses: data.questionById?.allowAnonymousResponses,
    },
  });

  const watchCharacterLimit = watch("enforceCharLimit");

  const handleCreateEmbed = (data: NewQuestionEmbedForm) => {
    const {
      prompt,
      enforceCharLimit,
      responseCharLimit,
      responsePlaceholderText,
    } = data;

    upsertQuestion.mutate(
      {
        input: {
          id: data.questionById.id as string,
          prompt,
          responseCharLimit:
            enforceCharLimit && responseCharLimit ? responseCharLimit : null,
          responsePlaceholderText,
          allowAnonymousResponses: data.allowAnonymousResponses,
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
        onSuccess: (data) => {},
      }
    );
  };

  return (
    <form onSubmit={handleSubmit(handleCreateEmbed)}>
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
            <Checkbox
              id="allowAnonymousResponses"
              name="allowAnonymousResponses"
              label="Allow Anonymous Responses"
              register={register}
            />
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
          label={buttonLabel}
          type="submit"
          disabled={
            !isDirty || !isValid || isSubmitting || upsertQuestion.isPending
          }
        />
      </div>
    </form>
  );
}

NewQuestionEmbed.getLayout = (page: ReactNode) => (
  <Layout>
    <DashboardTopNav />
    {page}
  </Layout>
);

export default NewQuestionEmbed;
