import clsx from "clsx";
import styles from "./ConversationEmbed.module.scss";
import { Avatar, OrganizationAvatar } from "components/Avatar/Avatar";
import {
  ArgumentPosition,
  StatementResult,
  useAddStatementToConversationMutation,
  useConversationByIdQuery,
  useConversationEmbedByIdQuery,
  useConversationOpinionAnalysisQuery,
  useGetRelatedStatementsQuery,
  useOrganizationByIdQuery,
  useVoteOnStatementMutation,
} from "generated";
import { Button } from "components/Button/Button";
import { WidgetFooter } from "components/WidgetFooter/WidgetFooter";
import { useEmbedResizer } from "hooks/useEmbedResizer";
import { useMemo, useState } from "react";
import { LeftArrowIcon } from "components/Icons";
import { Badge, Divider, LoaderFlag, RadioGroup, TextInput } from "components";
import { PageIndex } from "components/PageIndex/PageIndex";
import { FaCheckCircle, FaCircle, FaMinusCircle } from "react-icons/fa";
import { BsCircleFill } from "react-icons/bs";
import { AiFillCloseCircle } from "react-icons/ai";
import { useForm } from "react-hook-form";
import { PERSON_FALLBACK_IMAGE_LIGHT_400_URL } from "utils/constants";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import useDebounce from "hooks/useDebounce";

interface ConversationEmbedRenderOptions {
  _tbd: unknown;
}

export function ConversationEmbed({
  embedId,
  origin,
  _renderOptions,
}: {
  embedId: string;
  origin: string;
  _renderOptions: ConversationEmbedRenderOptions;
}) {
  const [currentView, setView] = useState<
    "overview" | "participate" | "insights" | "statement"
  >("overview");
  const { data, isLoading } = useConversationEmbedByIdQuery({ id: embedId });
  const { data: conversationData, isLoading: isConversationLoading } =
    useConversationByIdQuery(
      { id: data?.embedById?.conversation?.id as string },
      {
        enabled: !!data?.embedById?.conversation?.id,
      }
    );
  const { data: organizationData, isLoading: orgIsLoading } =
    useOrganizationByIdQuery(
      {
        id: data?.embedById?.organizationId as string,
      },
      {
        enabled: !!data?.embedById?.organizationId,
      }
    );

  const conversation = conversationData?.conversationById;

  const orgThumbnail = organizationData?.organizationById.assets
    .thumbnailImage160 as string;

  useEmbedResizer({ origin, embedId });

  const BackNav = () => {
    return (
      <button
        className={clsx(styles.backButton)}
        onClick={() => setView("overview")}
      >
        <LeftArrowIcon color="black" className={styles.backButtonChevron} />
        <OrganizationAvatar
          src={orgThumbnail}
          alt="Organization Logo"
          size={40}
        />
        <span>{conversation?.topic}</span>
      </button>
    );
  };

  const { register, control, reset, handleSubmit, watch } = useForm<{
    statement: string;
  }>();

  const draftStatement = watch("statement");
  const debouncedDraft = useDebounce(draftStatement?.trim(), 300);

  const { data: relatedStatementsData } = useGetRelatedStatementsQuery(
    {
      conversationId: conversation?.id as string,
      draftContent: debouncedDraft,
      limit: 5,
    },
    {
      enabled: debouncedDraft?.length >= 3,
    }
  );

  const relatedStatements =
    relatedStatementsData?.conversationById?.relatedStatements || [];

  const [currentStatementIndex, setCurrentStatementIndex] = useState(0);
  const currentStatement = conversation?.statements[currentStatementIndex];
  const handleStatementChange = (index: number) => {
    setCurrentStatementIndex(index);
  };
  const [relatedStatementIndex, setRelatedStatementIndex] = useState(0);
  const currentRelatedStatement = relatedStatements[relatedStatementIndex];
  const handleRelatedStatementChange = (index: number) => {
    setRelatedStatementIndex(index);
  };

  const voteOnStatementMutation = useVoteOnStatementMutation();
  const addStatementMutation = useAddStatementToConversationMutation();

  const handleNewStatement = async (data: { statement: string }) => {
    try {
      await addStatementMutation.mutateAsync({
        conversationId: conversation?.id as string,
        content: data.statement,
      });
      await queryClient.invalidateQueries({
        queryKey: useConversationByIdQuery.getKey({
          id: conversation?.id as string,
        }),
      });
      reset();
      toast.success("Your statement has been added to the conversation!");
      setView("participate");
    } catch (error) {
      toast.error("Failed to add statement");
    }
  };

  const queryClient = useQueryClient();

  const handleVote = async (statementId: string, vote: ArgumentPosition) => {
    await voteOnStatementMutation.mutateAsync(
      {
        statementId,
        voteType: vote,
      },
      {
        onSuccess: () => {
          void queryClient.invalidateQueries({
            queryKey: useConversationByIdQuery.getKey({
              id: conversation?.id as string,
            }),
          });
          setTimeout(() => {
            setCurrentStatementIndex((prev) => prev + 1);
          }, 1000);
        },
      }
    );
  };

  if (isLoading || orgIsLoading || isConversationLoading) return null;

  return (
    <div
      className={clsx(
        styles.widgetContainer,
        styles.conversationEmbedContainer
      )}
    >
      <header className={styles.header}>
        <h4>Conversation</h4>
      </header>
      {currentView === "overview" && (
        <main className={clsx(styles.centered, styles.flexColumn)}>
          <div className={clsx(styles.centered, styles.flexColumn)}>
            <OrganizationAvatar
              src={orgThumbnail}
              alt="Organization Logo"
              size={100}
            />
            <h3>{organizationData?.organizationById.name}</h3>
          </div>
          <h1>{conversation?.topic}</h1>
          <p>{conversation?.description}</p>
          <p className={styles.helperText}>
            Join the conversation by supporting or opposing statements, or write
            your own if you don't see your opinion represented.
          </p>
          <div className={styles.flex}>
            <Button
              variant="primary"
              label="Participate"
              onClick={() => setView("participate")}
            />
            <Button
              variant="secondary"
              label="Insights"
              onClick={() => setView("insights")}
            />
          </div>
        </main>
      )}
      {currentView === "participate" && (
        <>
          <BackNav />
          <main className={clsx(styles.centered, styles.flexColumn)}>
            <RadioGroup
              theme="grey"
              options={["participate", "insights"]}
              selected={currentView}
              onChange={(value) => setView(value)}
            />
            <h3 className={styles.flexBetween} style={{ width: "auto" }}>
              Statements{" "}
              <Badge size="small">{conversation?.statements.length}</Badge>
            </h3>

            <PageIndex
              data={conversation?.statements as StatementResult[]}
              onPageChange={(index) => handleStatementChange(index)}
              currentPage={currentStatementIndex}
              theme="grey"
            />

            <EmbedStatementBox
              statement={currentStatement as StatementResult}
              handleVote={handleVote}
            />
            <div className={styles.actions}>
              <Button
                variant="secondary"
                size="large"
                label="Add a statement"
                onClick={() => setView("statement")}
              />
            </div>
          </main>
        </>
      )}
      {currentView === "statement" && (
        <>
          <BackNav />
          <main className={clsx(styles.centered, styles.flexColumn)}>
            <h3 className={styles.flexBetween}>Add a statement</h3>
            <p>
              Your statement should present{" "}
              <strong>one clear, standalone idea</strong> that brings fresh
              insight to the discussion.
            </p>
            <form
              className={clsx(styles.formContainer)}
              onSubmit={handleSubmit(handleNewStatement)}
              style={{ width: "100%" }}
            >
              <TextInput
                textarea
                name="statement"
                placeholder="Add statement here"
                register={register}
                control={control}
              />
              <div className={styles.formActions}>
                <Button
                  size="large"
                  variant="secondary"
                  label="Cancel"
                  onClick={() => setView("participate")}
                />
                <Button
                  size="large"
                  variant="primary"
                  label="Submit"
                  type="submit"
                />
              </div>
            </form>
            {relatedStatements.length > 0 && (
              <>
                <div className={styles.relatedStatements}>
                  <h3>Related Statements</h3>
                  {relatedStatements.length > 1 && (
                    <PageIndex
                      data={relatedStatements as StatementResult[]}
                      onPageChange={(index) =>
                        handleRelatedStatementChange(index)
                      }
                      currentPage={relatedStatementIndex}
                      theme="grey"
                    />
                  )}
                  <EmbedStatementBox
                    key={currentRelatedStatement?.id as string}
                    statement={currentRelatedStatement as StatementResult}
                    handleVote={handleVote}
                  />
                </div>
              </>
            )}
          </main>
        </>
      )}
      {currentView === "insights" && (
        <>
          <BackNav />
          <main className={clsx(styles.centered, styles.flexColumn)}>
            <RadioGroup
              theme="grey"
              options={["participate", "insights"]}
              selected={currentView}
              onChange={(value) => setView(value)}
            />
            <Insights conversationId={conversation?.id as string} />
          </main>
        </>
      )}

      <WidgetFooter />
    </div>
  );
}

type Opinion = {
  content: string;
  supportVotes: number;
  opposeVotes: number;
  neutralVotes: number;
};

type OpinionSectionProps = {
  title: string;
  opinions: Opinion[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
};

const OpinionSection = ({
  title,
  opinions,
  currentIndex,
  onIndexChange,
}: OpinionSectionProps) => {
  return (
    <div>
      <h3>{title}</h3>
      <PageIndex
        data={opinions}
        currentPage={currentIndex}
        onPageChange={onIndexChange}
      />
      <div className={styles.statementStatsBox}>
        <p>{opinions[currentIndex]?.content}</p>
        <div className={styles.voteOptions}>
          <button className={clsx(styles.voteBadge, styles.support)}>
            <span className={styles.iconStack}>
              <FaCircle size={21} color="white" />
              <FaCheckCircle size={21} color="var(--green-support)" />
            </span>
            {opinions[currentIndex]?.supportVotes}
          </button>
          <button className={clsx(styles.voteBadge, styles.oppose)}>
            <span className={styles.iconStack}>
              <BsCircleFill size={21} color="white" />
              <AiFillCloseCircle size={21} color="var(--red)" />
            </span>
            {opinions[currentIndex]?.opposeVotes}
          </button>
          <button className={clsx(styles.voteBadge, styles.neutral)}>
            <span className={styles.iconStack}>
              <BsCircleFill size={21} color="white" />
              <FaMinusCircle size={21} color="var(--grey)" />
            </span>
            {opinions[currentIndex]?.neutralVotes}
          </button>
        </div>
        {/* TODO: implement bar chart */}
      </div>
    </div>
  );
};

function Insights({ conversationId }: { conversationId: string }) {
  const { data, isLoading } = useConversationOpinionAnalysisQuery(
    {
      conversationId,
    },
    {
      enabled: !!conversationId,
    }
  );
  const opinionAnalysis = data?.conversationById?.opinionAnalysis;
  const opinionGroups = data?.conversationById?.opinionGroups || [];

  const [tab, setTab] = useState<string>("overview");

  const [consensusOpinionIndex, setConsensusOpinionIndex] = useState<number>(0);
  const [divisiveOpinionIndex, setDivisiveOpinionIndex] = useState<number>(0);
  const [groupOpinionIndices, setGroupOpinionIndices] = useState<
    Record<string, number>
  >(
    opinionGroups.reduce(
      (acc, g) => {
        acc[g.id] = 0;
        return acc;
      },
      {} as Record<string, number>
    )
  );

  const handleGroupOpinionIndexChange = (groupId: string, newIndex: number) => {
    setGroupOpinionIndices((prevIndices) => ({
      ...prevIndices,
      [groupId]: newIndex,
    }));
  };

  if (isLoading) return <LoaderFlag theme="gray" />;

  return (
    <div>
      <div className={styles.insightsTabs}>
        <button
          className={clsx({ [styles.active as string]: tab === "overview" })}
          onClick={() => setTab("overview")}
        >
          Overview
        </button>
        {opinionGroups.map((group, index) => (
          <button
            key={index}
            className={clsx({
              [styles.active as string]: tab === `group${index}`,
            })}
            onClick={() => setTab(`group${index}`)}
          >
            Group {String.fromCharCode(65 + index)}
          </button>
        ))}
      </div>
      {tab === "overview" && (
        <div>
          <h2>Overview</h2>
          <p className={styles.overviewText}>
            {opinionAnalysis?.overview || "No overview available"}
          </p>
          {opinionGroups.map((group, index) => (
            <div className={styles.groupSummary} key={index}>
              <h3>Group {String.fromCharCode(65 + index)} Summary</h3>
              <p>{group?.summary || "No summary available"}</p>
            </div>
          ))}
          <Divider color="var(--grey-light)" />
          <OpinionSection
            title="Overall Consensus"
            opinions={opinionAnalysis?.consensusOpinions || []}
            currentIndex={consensusOpinionIndex}
            onIndexChange={setConsensusOpinionIndex}
          />
          <Divider color="var(--grey-light)" />
          <OpinionSection
            title="Most Divisive Topics"
            opinions={opinionAnalysis?.divisiveOpinions || []}
            currentIndex={divisiveOpinionIndex}
            onIndexChange={setDivisiveOpinionIndex}
          />
        </div>
      )}
      {opinionGroups.map(
        (group, index) =>
          tab === `group${index}` && (
            <div key={index}>
              <h3>Group {String.fromCharCode(65 + index)}</h3>
              <p className={styles.overviewText}>
                {group?.summary ||
                  `No group ${String.fromCharCode(65 + index)} overview available`}
              </p>
              <Divider color="var(--grey-light)" />
              <OpinionSection
                title="Characteristic Votes"
                opinions={
                  group?.characteristicVotes.map((v) => v.statement) || []
                }
                currentIndex={groupOpinionIndices[index] as number}
                onIndexChange={(newIndex) => {
                  handleGroupOpinionIndexChange(group.id, newIndex);
                }}
              />
            </div>
          )
      )}
    </div>
  );
}

function EmbedStatementBox({
  statement,
  handleVote,
}: {
  statement: StatementResult;
  handleVote: (statementId: string, vote: ArgumentPosition) => void;
}) {
  const currentVote = statement?.voteByUserOrSession;

  // Memoize the profile picture URL to help with debugging
  const profilePictureUrl = useMemo(() => {
    return (
      statement?.author?.profilePictureUrl ||
      PERSON_FALLBACK_IMAGE_LIGHT_400_URL
    );
  }, [statement?.author?.profilePictureUrl]);

  // Add null check for statement
  if (!statement) {
    return null;
  }

  return (
    <div className={styles.statementContainer}>
      <div className={styles.statementBox}>
        <p>{statement.content}</p>

        <div className={styles.voteOptions}>
          <button
            className={clsx(styles.voteBadge, styles.support, {
              [styles.selected as string]:
                currentVote === ArgumentPosition.Support,
            })}
            onClick={() => handleVote(statement.id, ArgumentPosition.Support)}
          >
            <span className={styles.iconStack}>
              <FaCircle size={21} color="white" />
              <FaCheckCircle size={21} color="var(--green-support)" />
            </span>
            <span>Support</span>
          </button>
          <button
            className={clsx(styles.voteBadge, styles.oppose, {
              [styles.selected as string]:
                currentVote === ArgumentPosition.Oppose,
            })}
            onClick={() => handleVote(statement.id, ArgumentPosition.Oppose)}
          >
            <span className={styles.iconStack}>
              <BsCircleFill size={21} color="white" />
              <AiFillCloseCircle size={21} color="var(--red)" />
            </span>
            <span>Oppose</span>
          </button>
          <button
            className={clsx(styles.voteBadge, styles.neutral, {
              [styles.selected as string]:
                currentVote === ArgumentPosition.Neutral,
            })}
            onClick={() => handleVote(statement.id, ArgumentPosition.Neutral)}
          >
            <span className={styles.iconStack}>
              <BsCircleFill size={21} color="white" />
              <FaMinusCircle size={21} color="var(--grey)" />
            </span>
            <span>Neutral</span>
          </button>
        </div>
      </div>
      <div className={styles.authorInfo}>
        <div className={styles.flexLeft}>
          <Avatar
            key={profilePictureUrl} // Add key to force re-render when URL changes
            src={profilePictureUrl}
            alt="profile picture"
            size={25}
          />
          <span>
            {statement.author
              ? `${statement.author.firstName} ${statement.author.lastName}`
              : "Anonymous participant"}
          </span>
        </div>
        <small>{new Date(statement.createdAt).toLocaleString()}</small>
      </div>
    </div>
  );
}
