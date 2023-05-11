import { Button, Layout, TextInput } from "components";
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
  useUpsertPollMutation,
} from "generated";
import { useAuth } from "hooks/useAuth";
import { toast } from "react-toastify";
import { Box } from "components/Box/Box";
import { Checkbox } from "components/Checkbox/Checkbox";
import { useFieldArray, useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { useTheme } from "hooks/useTheme";

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

type NewPollEmbedForm = {
  prompt: string;
  allowAnonymousResponses?: boolean;
  allowWriteInResponses?: boolean;
  options: {
    optionText: string;
  }[];
};

function NewPollEmbed() {
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1>New Poll Embed</h1>
      </div>

      <Box>
        <PollEmbedForm buttonLabel="Create Embed" />
      </Box>
    </>
  );
}

export function PollEmbedForm({
  buttonLabel = "Save",
  embed,
}: {
  buttonLabel: string;
  embed?: EmbedResult;
}) {
  const router = useRouter();
  const { query } = router;
  const queryClient = useQueryClient();
  const { slug } = query;
  const { user } = useAuth({ redirect: false });
  const upsertEmbed = useUpsertEmbedMutation();
  const upsertPoll = useUpsertPollMutation();
  const { theme } = useTheme();

  const {
    register,
    control,
    handleSubmit,
    formState: { isValid, isDirty, isSubmitting },
    reset,
  } = useForm<NewPollEmbedForm>({
    mode: "onChange",
    defaultValues: {
      prompt: embed?.poll?.prompt,
      allowAnonymousResponses: embed?.poll?.allowAnonymousResponses,
      allowWriteInResponses: embed?.poll?.allowWriteInResponses,
      options: embed?.poll?.options?.map((option) => ({
        id: option.id,
        optionText: option.optionText,
      })) || [{ optionText: "" }, { optionText: "" }],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "options",
    rules: { minLength: 2 },
  });
  const handleCreateEmbed = (data: NewPollEmbedForm) => {
    const { prompt, allowAnonymousResponses, allowWriteInResponses, options } =
      data;

    upsertPoll.mutate(
      {
        input: {
          id: embed?.attributes.pollId as string,
          prompt,
          allowAnonymousResponses,
          allowWriteInResponses,
          options,
        },
      },
      {
        onError: (error) => {
          toast(
            `Something went wrong saving this embed: ${(
              error as Error
            ).message.toString()}`,
            {
              type: "error",
              position: "bottom-right",
            }
          );
        },
        onSuccess: (data) => {
          reset(data.upsertPoll);
          upsertEmbed.mutate(
            {
              input: {
                id: embed?.id as string,
                name: "Politician Embed",
                populistUrl: "https://populist.us",
                embedType: EmbedType.Poll,
                organizationId: user?.organizationId as string,
                attributes: {
                  pollId: data.upsertPoll.id,
                  embedType: "question",
                },
              },
            },
            {
              onError: (error) => {
                toast(
                  `Something went wrong saving this embed: ${(
                    error as any
                  ).toString()}`,
                  {
                    type: "error",
                    position: "bottom-right",
                  }
                );
              },
              onSuccess: (data) => {
                toast("Embed saved!", {
                  type: "success",
                  position: "bottom-right",
                  autoClose: 1000,
                });
                void queryClient.invalidateQueries(
                  useEmbedByIdQuery.getKey({ id: router.query.id as string })
                );
                void router.push(
                  `/dashboard/${slug}/embeds/poll/${data.upsertEmbed.id}`,
                  undefined,
                  {
                    shallow: true,
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
          gap: "1.75rem",
        }}
      >
        <section
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 4fr",
            gap: "1rem",
          }}
        >
          <h3>Prompt</h3>
          <TextInput
            id="prompt"
            name="prompt"
            size="medium"
            placeholder="What question would you like to ask?"
            register={register}
            rules={{
              required: "Prompt is required",
            }}
          />
        </section>
        <section>
          <h3>Choices</h3>

          {fields.map((field, index) => (
            <div
              style={{
                display: "inline-flex",
                gap: "1rem",
                width: "100%",
                margin: "0.5rem 0",
              }}
              key={`choices.${index}.text`}
            >
              <TextInput
                id={`options.${index}.optionText`}
                name={`options.${index}.optionText` as const}
                size="small"
                placeholder="Enter an answer for this question"
                register={register}
                rules={{
                  required: "Two or more choices are required",
                }}
              />
              <Button
                size="small"
                variant="secondary"
                theme="red"
                label="Remove Option"
                onClick={() => remove(index)}
              />
            </div>
          ))}
          <div
            style={{
              display: "inline-flex",
              justifyContent: "flex-end",
              marginTop: "1rem",
              width: "100%",
            }}
          >
            <Button
              size="small"
              label="Add Another Option"
              variant="primary"
              theme={theme}
              onClick={() => {
                append({ optionText: "" });
              }}
            />
          </div>
        </section>
        <section
          style={{
            display: "grid",
            gap: "1rem",
            borderTop: "1px solid var(--blue-dark)",
            padding: "1rem 0",
          }}
        >
          <Checkbox
            id="allowAnonymousResponses"
            name="allowAnonymousResponses"
            label="Allow Anonymous Responses"
            register={register}
          />
          <Checkbox
            id="allowWriteInResponses"
            name="allowWriteInResponses"
            label="Allow Write In Response"
            register={register}
          />
        </section>
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
            !isDirty || !isValid || isSubmitting || upsertPoll.isLoading
          }
        />
      </div>
    </form>
  );
}

NewPollEmbed.getLayout = (page: ReactNode) => (
  <Layout>
    <DashboardTopNav />
    {page}
  </Layout>
);

export default NewPollEmbed;
