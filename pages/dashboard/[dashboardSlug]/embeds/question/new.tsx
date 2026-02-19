import { Button, Layout, TextInput } from "components";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { ReactNode } from "react";
import { SupportedLocale } from "types/global";
import { DashboardTopNav } from "../..";
import nextI18nextConfig from "next-i18next.config";
import { useRouter } from "next/router";
import {
  EmbedType,
  useOrganizationBySlugQuery,
  useQuestionEmbedByIdQuery,
  useUpsertEmbedMutation,
  useUpsertQuestionMutation,
} from "generated";
import { toast } from "react-toastify";
import { Box } from "components/Box/Box";
import { Checkbox } from "components/Checkbox/Checkbox";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import styles from "./index.module.scss";

export async function getServerSideProps({
  query,
  locale,
}: {
  query: { dashboardSlug: string };
  locale: SupportedLocale;
}) {
  return {
    props: {
      dashboardSlug: query.dashboardSlug,
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

function NewQuestionEmbed() {
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1>New Question Embed</h1>
      </div>

      <Box>
        <QuestionEmbedForm buttonLabel="Create Embed" />
      </Box>
    </>
  );
}

export function QuestionEmbedForm({
  buttonLabel = "Save",
  embedId,
  candidateGuideId,
  onSuccess,
}: {
  buttonLabel: string;
  embedId?: string;
  candidateGuideId?: string;
  onSuccess?: () => void;
}) {
  const router = useRouter();
  const { query } = router;
  const queryClient = useQueryClient();
  const { dashboardSlug } = query;
  const { data: organizationData } = useOrganizationBySlugQuery(
    {
      slug: dashboardSlug as string,
    },
    {
      enabled: !!dashboardSlug,
    }
  );
  const { data: emebdData } = useQuestionEmbedByIdQuery({
    id: embedId as string,
  });

  const embed = emebdData?.embedById;

  const currentOrganizationId = organizationData?.organizationBySlug?.id;
  const upsertEmbed = useUpsertEmbedMutation();
  const upsertQuestion = useUpsertQuestionMutation();

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { isValid, isDirty, isSubmitting },
    reset,
  } = useForm<NewQuestionEmbedForm>({
    mode: "onChange",
    defaultValues: {
      prompt: embed?.question?.prompt,
      enforceCharLimit: !!embed?.question?.responseCharLimit,
      responseCharLimit: embed?.question?.responseCharLimit || 140,
      responsePlaceholderText: embed?.question?.responsePlaceholderText || "",
      allowAnonymousResponses: embed?.question?.allowAnonymousResponses,
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
          id: embed?.attributes?.questionId as string,
          prompt,
          responseCharLimit:
            enforceCharLimit && responseCharLimit ? responseCharLimit : null,
          responsePlaceholderText,
          allowAnonymousResponses: data.allowAnonymousResponses,
          candidateGuideId,
          organizationId: currentOrganizationId as string,
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
        onSuccess: (data) => {
          reset(data.upsertQuestion);
          if (candidateGuideId) {
            if (onSuccess) onSuccess();
            return;
          } // Don't create an embed if this is a candidate guide question
          upsertEmbed.mutate(
            {
              input: {
                id: embed?.id as string,
                name: "Question Embed",
                embedType: EmbedType.Question,
                organizationId: currentOrganizationId as string,
                attributes: {
                  questionId: data.upsertQuestion.id,
                },
              },
            },
            {
              onSuccess: (data) => {
                toast("Embed saved!", {
                  type: "success",
                  position: "bottom-right",
                  autoClose: 1000,
                });
                void queryClient.invalidateQueries({
                  queryKey: useQuestionEmbedByIdQuery.getKey({
                    id: router.query.id as string,
                  }),
                });
                void router.push(
                  `/dashboard/${dashboardSlug}/embeds/question/${data.upsertEmbed.id}/manage`,
                  undefined,
                  {
                    shallow: true,
                    scroll: false,
                  }
                );
              },
            }
          );
        },
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
        <section className={styles.optionsGroup}>
          <TextInput
            id="prompt"
            name="prompt"
            label="Question Text"
            size="small"
            placeholder="What question would you like to ask?"
            register={register}
            control={control}
            rules={{
              required: "Prompt is required",
            }}
          />

          <TextInput
            id="responsePlaceholderText"
            name="responsePlaceholderText"
            label="Response Placeholder Text"
            size="small"
            placeholder="What placeholder text would you like respondents to see?"
            register={register}
            control={control}
          />
        </section>

        <section className={styles.optionsGroup}>
          <div className={styles.optionsContainer}>
            <div className={styles.divider} />
            <Checkbox
              id="allowAnonymousResponses"
              name="allowAnonymousResponses"
              label="Allow Anonymous Responses"
              register={register}
            />
            <div className={styles.enforceCharLimitContainer}>
              <Checkbox
                id="enforceCharLimit"
                name="enforceCharLimit"
                label="Enforce character limit for responses"
                register={register}
              />
              {watchCharacterLimit && (
                <div className={styles.charLimitInput}>
                  <TextInput
                    size="small"
                    type="number"
                    hideLabel={true}
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
          </div>
          <div className={styles.divider} />
        </section>

        <section></section>
      </div>
      <div className={styles.buttonContainer}>
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
