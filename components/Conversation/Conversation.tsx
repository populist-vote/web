import { Box } from "components/Box/Box";
import Divider from "components/Divider/Divider";
import { TextInput } from "components/TextInput/TextInput";
import { useForm } from "react-hook-form";
import styles from "./Conversation.module.scss";
import { Badge } from "components/Badge/Badge";
import { FaCheckCircle, FaCircle, FaMinusCircle } from "react-icons/fa";
import { Button } from "components/Button/Button";
import { PERSON_FALLBACK_IMAGE_400_URL } from "utils/constants";
import { Avatar } from "components/Avatar/Avatar";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArgumentPosition,
  ConversationResult,
  OpinionScore,
  StatementModerationStatus,
  StatementResult,
  useAddStatementToConversationMutation,
  useConversationByIdQuery,
  useGetRelatedStatementsQuery,
  useVoteOnStatementMutation,
} from "generated";
import { LoaderFlag } from "components/LoaderFlag/LoaderFlag";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import useDebounce from "hooks/useDebounce";
import clsx from "clsx";
import { AiFillCloseCircle } from "react-icons/ai";
import { BsCircleFill } from "react-icons/bs";
import { PageIndex } from "components/PageIndex/PageIndex";
import { useAuth } from "hooks/useAuth";
import { RadioGroup } from "components/RadioGroup/RadioGroup";

export function Conversation({
  id,
  viewMode,
}: {
  id: string;
  viewMode: "participate" | "insights";
}) {
  const { register, control, handleSubmit, reset, watch } = useForm<{
    statement: string;
  }>();

  const { data, isLoading } = useConversationByIdQuery({
    id,
    // TODO: Make this configurable
    moderationStatuses: [
      StatementModerationStatus.Accepted,
      StatementModerationStatus.Seed,
      StatementModerationStatus.Unmoderated,
    ],
  });

  const draftStatement = watch("statement");
  const debouncedDraft = useDebounce(draftStatement?.trim(), 300);

  const { data: relatedStatementsData, isLoading: relatedStatementsLoading } =
    useGetRelatedStatementsQuery(
      {
        conversationId: id,
        draftContent: debouncedDraft,
        limit: 5,
      },
      {
        enabled: debouncedDraft?.length >= 3,
      }
    );
  const addStatementMutation = useAddStatementToConversationMutation();
  const voteOnStatementMutation = useVoteOnStatementMutation();
  const queryClient = useQueryClient();

  const handleNewStatement = async (data: { statement: string }) => {
    try {
      await addStatementMutation.mutateAsync({
        conversationId: id,
        content: data.statement,
      });
      await queryClient.invalidateQueries({
        queryKey: useConversationByIdQuery.getKey({ id }),
      });
      reset();
      toast.success("Your statement has been added to the conversation!");
    } catch (error) {
      toast.error("Failed to add statement");
    }
  };

  const [animatingRelatedStatements, setAnimatingRelatedStatements] = useState<
    Set<string>
  >(new Set());
  const [localRelatedStatements, setLocalRelatedStatements] = useState<
    StatementResult[]
  >([]);

  // Keep local state in sync with query data
  useEffect(() => {
    setLocalRelatedStatements(
      (relatedStatementsData?.conversationById?.relatedStatements ||
        []) as StatementResult[]
    );
  }, [relatedStatementsData]);

  const handleVote = async (statementId: string, vote: ArgumentPosition) => {
    try {
      // Check if the statement exists in related statements
      const isRelatedStatement = localRelatedStatements.some(
        (s) => s.id === statementId
      );

      // If it's a related statement, start its removal animation
      if (isRelatedStatement) {
        setAnimatingRelatedStatements((prev) => new Set(prev).add(statementId));
        // Remove from local state after animation duration
        setTimeout(() => {
          setLocalRelatedStatements((prev) =>
            prev.filter((s) => s.id !== statementId)
          );
        }, 300);
      }

      // Submit the vote
      await voteOnStatementMutation.mutateAsync(
        {
          statementId,
          voteType: vote,
        },
        {
          onSuccess: () => {
            void queryClient.invalidateQueries({
              queryKey: useConversationByIdQuery.getKey({ id }),
            });
          },
        }
      );

      // Invalidate queries after animation completes
      setTimeout(async () => {
        await queryClient.invalidateQueries({
          queryKey: useConversationByIdQuery.getKey({ id }),
        });

        handleStatementChange(currentStatementIndex + 1);
      }, 300);

      toast.success("Your vote has been submitted!");
    } catch (error) {
      toast.error("Failed to submit vote");
      setAnimatingRelatedStatements((prev) => {
        const next = new Set(prev);
        next.delete(statementId);
        return next;
      });
    }
  };

  const [currentStatementIndex, setCurrentStatementIndex] = useState(0);

  const [direction, setDirection] = useState<1 | -1>(1);

  const handleStatementChange = (index: number) => {
    const newDirection = index > currentStatementIndex ? 1 : -1;
    setDirection(newDirection);

    // Change index almost immediately
    requestAnimationFrame(() => {
      setCurrentStatementIndex(index);
    });
  };

  const conversation = data?.conversationById as ConversationResult;
  const statements = (conversation?.statements || []) as StatementResult[];

  const slideVariants = {
    enterFromRight: {
      x: 100,
      opacity: 0,
      scale: 0.99,
    },
    enterFromLeft: {
      x: -100,
      opacity: 0,
      scale: 0.99,
    },
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        duration: 0.7,
        bounce: 0,
        stiffness: 150,
        damping: 25,
      },
    },
    exitToLeft: {
      x: -100,
      opacity: 0,
      scale: 0.99,
      transition: {
        type: "spring",
        duration: 0.5,
        bounce: 0,
        stiffness: 150,
        damping: 25,
      },
    },
    exitToRight: {
      x: 100,
      opacity: 0,
      scale: 0.99,
      transition: {
        type: "spring",
        duration: 0.5,
        bounce: 0,
        stiffness: 150,
        damping: 25,
      },
    },
  };

  if (isLoading) return <LoaderFlag />;

  return (
    <div style={{ margin: "3rem 0" }}>
      <div className={styles.conversationHeader}>
        <h1>{conversation.topic}</h1>
        <p>{conversation.description}</p>
      </div>
      <Divider />

      {viewMode === "participate" && (
        <>
          <div className={styles.statementsHeading}>
            <h2>
              Statements{" "}
              <Badge size="medium" theme="blue">
                {conversation.statements.length}
              </Badge>
            </h2>
          </div>
          <PageIndex
            data={statements}
            onPageChange={(index) => handleStatementChange(index)}
            currentPage={currentStatementIndex}
          />

          {/* Animated statement */}

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStatementIndex}
              initial={direction! > 0 ? "enterFromRight" : "enterFromLeft"}
              animate="center"
              exit={direction! > 0 ? "exitToLeft" : "exitToRight"}
              variants={slideVariants} // or fadeSlideVariants or crossfadeVariants
              style={{
                width: "100%",
                minHeight: "15rem",
              }}
            >
              <StatementBox
                statement={statements[currentStatementIndex] as StatementResult}
                handleVote={handleVote}
              />
              {currentStatementIndex >= statements.length ? (
                <Box>
                  <div className={styles.thanksBox}>
                    <h3>Thanks for voting!</h3>
                    <p>
                      Your participation helps us understand diverse
                      perspectives.
                    </p>
                  </div>
                </Box>
              ) : null}
            </motion.div>
          </AnimatePresence>

          <section className={styles.contributeSection}>
            <h3>Want to contribute your unique perspective?</h3>
            <Box>
              <form
                className={clsx(styles.formContainer)}
                onSubmit={handleSubmit(handleNewStatement)}
              >
                <TextInput
                  name="statement"
                  placeholder="Enter your statement here"
                  register={register}
                  control={control}
                  textarea
                />

                <div className={styles.statementInfo}>
                  <p>
                    Your statement should present{" "}
                    <strong>one clear, standalone idea </strong>that brings
                    fresh insight to the discussion.
                  </p>
                  <Button size="large" label="Submit" />
                </div>
              </form>
              {relatedStatementsLoading && (
                <div className={styles.centered}>
                  <span
                    className={styles.noResults}
                    style={{ margin: "1rem 0" }}
                  >
                    Loading related statements...
                  </span>
                </div>
              )}
            </Box>

            {localRelatedStatements.length > 0 && (
              <div className={styles.relatedStatements}>
                <h3>Related Statements</h3>
                <AnimatePresence mode="popLayout">
                  {localRelatedStatements.map((statement) => (
                    <motion.div
                      key={statement.id}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      variants={slideVariants}
                      style={{
                        transformOrigin: "center center",
                        opacity: animatingRelatedStatements.has(statement.id)
                          ? 0.5
                          : 1,
                      }}
                    >
                      <div
                        style={{
                          opacity: animatingRelatedStatements.has(statement.id)
                            ? 0.5
                            : 1,
                          transition: "opacity 0.2s",
                        }}
                      >
                        <StatementBox
                          statement={statement}
                          handleVote={handleVote}
                        />
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </section>
        </>
      )}
      {viewMode === "insights" && <Insights conversation={conversation} />}
    </div>
  );
}

function Insights({ conversation }: { conversation: ConversationResult }) {
  const [viewMode, setViewMode] = useState("overview");
  const [consensusPage, setConsensusPage] = useState(0);
  const [divisivePage, setDivisivePage] = useState(0);

  // Calculate paginated data
  const paginateData = (data: OpinionScore[], page: number) => {
    const start = page;
    return data.slice(start, start + 1);
  };

  // Get current page data
  const currentConsensusOpinions = paginateData(
    conversation.opinionAnalysis.consensusOpinions,
    consensusPage
  );

  const currentDivisiveOpinions = paginateData(
    conversation.opinionAnalysis.divisiveOpinions,
    divisivePage
  );

  // Handle page changes
  const handleConsensusPageChange = (index: number) => {
    setConsensusPage(index);
  };

  const handleDivisivePageChange = (index: number) => {
    setDivisivePage(index);
  };
  return (
    <div className={styles.overViewContainer}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "1.5rem",
        }}
      >
        <RadioGroup
          options={["overview", "groups"]}
          selected={viewMode}
          onChange={(tab) => setViewMode(tab as "overview" | "groups")}
        />
      </div>
      <h2>Overview</h2>
      <p style={{ color: "var(--blue-text)", margin: 0 }}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec
        odio. Praesent libero. Sed cursus ante dapibus diam. Lorem ipsum dolor
        sit amet, consectetur adipiscing elit. Integer nec odio. Praesent
        libero. Sed cursus ante dapibus diam. Lorem ipsum dolor sit amet,
      </p>
      <Divider />
      {conversation.opinionAnalysis.consensusOpinions.length > 0 && (
        <section>
          <h2>Consensus Opinions</h2>

          <PageIndex
            data={conversation.opinionAnalysis.consensusOpinions}
            onPageChange={handleConsensusPageChange}
            currentPage={consensusPage}
          />
          {currentConsensusOpinions.map((opinion: OpinionScore) => (
            <OpinionScoreStatement
              opinion={opinion}
              totalParticipants={conversation.stats.totalParticipants}
              key={opinion.id}
            />
          ))}
          <Divider />
        </section>
      )}
      {conversation.opinionAnalysis.divisiveOpinions.length > 0 && (
        <section>
          <h2>Divisive Opinions</h2>
          <PageIndex
            data={conversation.opinionAnalysis.divisiveOpinions}
            onPageChange={handleDivisivePageChange}
            currentPage={divisivePage}
          />
          {currentDivisiveOpinions.map((opinion: OpinionScore) => (
            <OpinionScoreStatement
              opinion={opinion}
              totalParticipants={conversation.stats.totalParticipants}
              key={opinion.id}
            />
          ))}
        </section>
      )}
    </div>
  );
}

function OpinionScoreStatement({
  opinion,
  totalParticipants,
}: {
  opinion: OpinionScore;
  totalParticipants: number;
}) {
  const supportPercentage = Math.round(
    (opinion.supportVotes / opinion.totalVotes) * 100
  );
  const opposePercentage = Math.round(
    (opinion.opposeVotes / opinion.totalVotes) * 100
  );
  const neutralPercentage = Math.round(
    (opinion.neutralVotes / opinion.totalVotes) * 100
  );
  const didntVotePercentage = Math.round(
    ((totalParticipants - opinion.totalVotes) / totalParticipants) * 100
  );

  return (
    <div className={styles.statement} key={opinion.id}>
      <p>{opinion.content}</p>
      <div className={styles.voteOptions}>
        <button className={clsx(styles.voteBadge, styles.support)}>
          <span className={styles.iconStack}>
            <FaCircle size={21} color="white" />
            <FaCheckCircle size={21} color="var(--green-support)" />
          </span>
          <span>Support</span>
          <span>— {opinion.supportVotes}</span>
        </button>
        <button className={clsx(styles.voteBadge, styles.oppose)}>
          <span className={styles.iconStack}>
            <BsCircleFill size={21} color="white" />
            <AiFillCloseCircle size={21} color="var(--red)" />
          </span>
          <span>Oppose</span>
          <span>— {opinion.opposeVotes}</span>
        </button>
        <button className={clsx(styles.voteBadge, styles.neutral)}>
          <span className={styles.iconStack}>
            <BsCircleFill size={21} color="white" />
            <FaMinusCircle size={21} color="var(--grey)" />
          </span>
          <span>Neutral</span>
          <span>— {opinion.neutralVotes}</span>
        </button>
      </div>
      <div className={styles.segmentedBar}>
        <div
          className={styles.segment}
          style={{
            width: `${supportPercentage}%`,
            backgroundColor: "var(--green-support)",
          }}
        />
        <div
          className={styles.segment}
          style={{
            width: `${opposePercentage}%`,
            backgroundColor: "var(--red)",
          }}
        />
        <div
          className={styles.segment}
          style={{
            width: `${neutralPercentage}%`,
            backgroundColor: "var(--grey)",
          }}
        />
        <div
          className={styles.segment}
          style={{
            width: `${didntVotePercentage}%`,
            backgroundColor: "var(--blue-dark)",
          }}
        />
      </div>
    </div>
  );
}

function StatementBox({
  statement,
  handleVote,
}: {
  statement: StatementResult;
  handleVote: (statementId: string, vote: ArgumentPosition) => void;
}) {
  const { user } = useAuth();
  if (!statement) return null;
  const isUserStatementAuthor = statement.author?.id == user?.id;
  const currentVote = statement.voteByUserOrSession;

  return (
    <div className={styles.statement}>
      <div className={styles.flexBetween}>
        <div className={styles.flexLeft}>
          <Avatar
            src={
              statement.author?.profilePictureUrl ||
              PERSON_FALLBACK_IMAGE_400_URL
            }
            alt="profile picture"
            size={25}
          />
          <strong>
            {statement.author
              ? `${statement.author?.firstName} ${statement.author?.lastName}`
              : "Anonymous participant"}
          </strong>
        </div>

        <small style={{ color: "var(--blue-text)" }}>
          {new Date(statement.createdAt).toLocaleString()}
        </small>
      </div>
      <p>{statement.content}</p>

      {!isUserStatementAuthor && (
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
      )}
    </div>
  );
}
