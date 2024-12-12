import {
  Box,
  Layout,
  LoaderFlag,
  RadioGroup,
  Divider,
  Button,
  TextInput,
} from "components";
import {
  ConversationResult,
  ConversationStats,
  StatementModerationStatus,
  useAddStatementToConversationMutation,
  useConversationByIdQuery,
  useUpdateConversationMutation,
} from "generated";
import { GetServerSideProps } from "next";
import nextI18nextConfig from "next-i18next.config";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { ReactNode, useEffect, useCallback, useRef, useState } from "react";
import { SupportedLocale } from "types/global";
import { DashboardTopNav } from "../..";
import { EmbedHeader } from "components/EmbedHeader/EmbedHeader";
import styles from "./manage.module.scss";
import { useForm } from "react-hook-form";
import useDebounce from "hooks/useDebounce";
import { EmbedCodeBlock } from "components/EmbedCodeBlock/EmbedCodeBlock";
import { toast } from "react-toastify";
import { Modal } from "components/Modal/Modal";
import { useQueryClient } from "@tanstack/react-query";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const locale = ctx.locale as SupportedLocale;
  return {
    props: {
      ...(await serverSideTranslations(
        locale,
        ["auth", "common"],
        nextI18nextConfig
      )),
    },
  };
};

export default function ConversationManagePage() {
  const router = useRouter();
  const { id, dashboardSlug } = router.query;
  const locale = router.locale;

  const { data, isLoading } = useConversationByIdQuery({
    id: id as string,
  });

  const conversation = data?.conversationById as ConversationResult;

  if (!conversation) return null;

  if (isLoading) {
    return <LoaderFlag />;
  }

  return (
    <div>
      <DashboardTopNav />
      <EmbedHeader
        title={conversation.topic}
        embedType="conversations"
        backLink={`/dashboard/${dashboardSlug}/conversations`}
      />
      <div className={styles.flexBetween}>
        <ConversationViewSwitcher
          currentView="manage"
          conversationId={id as string}
        />
        <div className={styles.flexLeft} style={{ color: "var(--blue-text)" }}>
          <small>
            Created{" "}
            <strong>
              {new Date(conversation.createdAt).toLocaleDateString(
                `${locale}-US`,
                {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  timeZone: "UTC",
                }
              )}
            </strong>
          </small>
          <Divider vertical />
          <small>
            Last Updated{" "}
            <strong>
              {new Date(conversation.updatedAt).toLocaleDateString(
                `${locale}-US`,
                {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  timeZone: "UTC",
                }
              )}
            </strong>
          </small>
        </div>
      </div>
      <StatsDisplay stats={conversation.stats} />
      <Divider />
      <ConfigureConversation conversation={conversation} />
      {/* Status - open + close */}
      {/* Share - copy embed code */}
    </div>
  );
}

ConversationManagePage.getLayout = (page: ReactNode) => <Layout>{page}</Layout>;

function StatsDisplay({ stats }: { stats: ConversationStats }) {
  const entries = Object.entries(stats || {}).filter(
    ([_, value]) => typeof value === "number"
  );

  return (
    <div className={styles.tiles}>
      {entries.map(([name, value]) => (
        <Box key={name}>
          <div className={styles.tile}>
            <h1 className={styles.value}>{value.toLocaleString()}</h1>
            <h4 className={styles.label}>
              {name
                .replace(/([A-Z])/g, " $1")
                .replace(/^./, (str) => str.toUpperCase())}
            </h4>
          </div>
        </Box>
      ))}
    </div>
  );
}

function ConfigureConversation({
  conversation,
}: {
  conversation: ConversationResult;
}) {
  const {
    register,
    control,
    watch,
    formState: { isDirty },
  } = useForm<{
    topic: string;
    description: string | null;
  }>({
    defaultValues: {
      topic: conversation.topic,
      description: conversation.description,
    },
  });

  // Watch for form changes
  const formValues = watch();
  const debouncedValues = useDebounce(formValues, 1000);

  // Track the last saved values to prevent duplicate saves
  const lastSavedValues = useRef(formValues);

  const updateConversationMutation = useUpdateConversationMutation();

  const handleSave = async (data: {
    topic: string;
    description: string | null;
  }) => {
    try {
      lastSavedValues.current = data;
      updateConversationMutation.mutate(
        {
          conversationId: conversation.id,
          topic: data.topic,
          description: data.description,
        },
        {
          onSuccess: () => toast.success("Conversation updated"),
        }
      );
    } catch (error) {
      // Handle error appropriately
      // showNotification({ message: 'Failed to save changes', type: 'error' });
      toast.error("Save failed");
    }
  };

  // Save whenever the debounced values change
  useEffect(() => {
    if (!isDirty) return;

    // Check if values have actually changed from last save
    const hasChanged =
      JSON.stringify(lastSavedValues.current) !==
      JSON.stringify(debouncedValues);

    if (hasChanged) {
      void handleSave(debouncedValues);
    }
  }, [debouncedValues, isDirty]);

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <div className={styles.flexBetween}>
        <h3>Configure</h3>
        <Button
          size="medium"
          variant="primary"
          label="Add Seed Statement"
          onClick={() => setIsOpen(true)}
        />
        <AddStatementModal
          isOpen={isOpen}
          handleClose={() => setIsOpen(false)}
          conversationId={conversation.id}
          moderationStatus={StatementModerationStatus.Seed}
        />
      </div>
      <Box>
        <form>
          <TextInput
            name="topic"
            label="Topic"
            register={register}
            control={control}
          />
          <br />
          <TextInput
            name="description"
            label="Description"
            register={register}
            control={control}
            textarea
          />
        </form>
      </Box>
      <Divider />
      <div className={styles.grid2}>
        <div>
          <h3>Share</h3>
          <Box>
            <Button
              size="medium"
              variant="primary"
              label="Copy Public URL"
              onClick={() => {
                void navigator.clipboard.writeText(
                  `${window.location.origin}/conversations/${conversation?.id}`
                );
                toast.success("URL copied to clipboard");
              }}
            />
          </Box>
        </div>
        <div>
          <h3>Embed</h3>
          <Box>
            <EmbedCodeBlock id="" />
          </Box>
        </div>
      </div>
    </div>
  );
}

export function ConversationViewSwitcher({
  currentView,
  conversationId,
}: {
  currentView: "manage" | "moderate";
  conversationId: string;
}) {
  const router = useRouter();
  const { dashboardSlug } = router.query;

  const handleViewChange = useCallback(
    async (newView: string) => {
      const url = `/dashboard/${dashboardSlug}/conversations/${conversationId}/${newView}`;

      try {
        // Start loading the new page in the background
        await router.prefetch(url);

        // Perform the navigation with shallow routing
        await router.push(
          {
            pathname: `/dashboard/[dashboardSlug]/conversations/[id]/${newView}`,
            query: {
              dashboardSlug,
              id: conversationId,
            },
          },
          url,
          { shallow: true }
        );
      } catch (error) {
        console.error("Navigation failed:", error);
      }
    },
    [router, dashboardSlug, conversationId]
  );

  // Prefetch the alternate view on mount
  useEffect(() => {
    const alternateView = currentView === "manage" ? "moderate" : "manage";
    const url = `/dashboard/${dashboardSlug}/conversations/${conversationId}/${alternateView}`;
    void router.prefetch(url);
  }, [currentView, router, dashboardSlug, conversationId]);

  return (
    <RadioGroup
      theme="yellow"
      options={["manage", "moderate"]}
      selected={currentView}
      onChange={handleViewChange}
    />
  );
}

export function AddStatementModal({
  conversationId,
  moderationStatus,
  isOpen,
  handleClose,
}: {
  conversationId: string;
  moderationStatus: StatementModerationStatus;
  isOpen: boolean;
  handleClose: () => void;
}) {
  const {
    register,
    control,
    handleSubmit,
    formState: { isDirty },
    reset,
  } = useForm({
    defaultValues: {
      statement: "",
    },
    mode: "onChange",
  });
  const addStatementMutation = useAddStatementToConversationMutation();

  const queryClient = useQueryClient();

  const handleNewStatement = async (data: { statement: string }) => {
    try {
      await addStatementMutation.mutateAsync({
        conversationId,
        content: data.statement,
        moderationStatus,
      });
      await queryClient.invalidateQueries({
        queryKey: useConversationByIdQuery.getKey({ id: conversationId }),
      });
      reset();
      toast.success("Your statement has been added to the conversation!");
    } catch (error) {
      toast.error("Failed to add statement");
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={() => handleClose()}>
        <form
          style={{ minWidth: "40vw", padding: "3rem" }}
          onSubmit={handleSubmit(handleNewStatement)}
        >
          <h1 style={{ textAlign: "center" }}>Add a statement</h1>
          <p style={{ color: "var(--blue-text-light)" }}>
            Your statement should present{" "}
            <strong>one clear, standalone idea</strong> that brings fresh
            insight to the discussion.
          </p>
          <TextInput
            name="statement"
            hideLabel
            label="Statement"
            placeholder="Add your statement here"
            register={register}
            control={control}
            textarea
          />
          <div className={styles.centered}>
            <Button
              size="large"
              variant="primary"
              label="Add Statement"
              type="submit"
              style={{ marginTop: "2rem" }}
              disabled={!isDirty}
            />
          </div>
        </form>
      </Modal>
    </>
  );
}
