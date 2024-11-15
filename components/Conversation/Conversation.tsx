import { Box } from "components/Box/Box";
import Divider from "components/Divider/Divider";
import { TextInput } from "components/TextInput/TextInput";
import { useForm } from "react-hook-form";
import styles from "./Conversation.module.scss";
import { BiInfoCircle } from "react-icons/bi";
import { Badge } from "components/Badge/Badge";
import { FaCheckCircle } from "react-icons/fa";
import { RiCloseCircleFill } from "react-icons/ri";
import { BsEmojiNeutral } from "react-icons/bs";
import { Button } from "components/Button/Button";
import { PERSON_FALLBACK_IMAGE_400_URL } from "utils/constants";
import { useAuth } from "hooks/useAuth";
import { Avatar } from "components/Avatar/Avatar";
import { Select } from "components/Select/Select";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArgumentPosition,
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

export function Conversation({ id }: { id: string }) {
  const { user } = useAuth();
  const { register, control, handleSubmit, reset, watch } = useForm<{
    statement: string;
  }>();

  const { data, isLoading } = useConversationByIdQuery({ id });

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
      // Check if the voted statement is the current main statement
      const isCurrentMainStatement = statementId === currentStatement?.id;

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
      await voteOnStatementMutation.mutateAsync({
        statementId,
        voteType: vote,
      });

      // Only animate and show next statement if we voted on the current main statement
      if (isCurrentMainStatement) {
        await handleShowNextStatement();
      }

      // Invalidate queries after animation completes
      setTimeout(async () => {
        await queryClient.invalidateQueries({
          queryKey: useConversationByIdQuery.getKey({ id }),
        });

        // Clear the animating state for this statement
        setAnimatingRelatedStatements((prev) => {
          const next = new Set(prev);
          next.delete(statementId);
          return next;
        });
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

  const [animate, setAnimate] = useState(true);

  const handleShowNextStatement = () => {
    // Start the exit animation
    setAnimate(false);

    // Change index almost immediately
    requestAnimationFrame(() => {
      setCurrentStatementIndex((prev) => prev + 1);
      setAnimate(true);
      // Show new statement right after index change
    });
  };

  const statements = (data?.conversationById?.statements ||
    []) as StatementResult[];
  const currentStatement = statements[currentStatementIndex];

  const getAnimationKey = (index: number) => `statement-${index}`;

  const slideVariants = {
    enter: {
      y: 100, // Reduced travel distance
      opacity: 0,
      scale: 0.95, // Less scale change for smoother feel
      rotateX: 15, // Reduced rotation for subtlety
    },
    center: {
      y: 0,
      opacity: 1,
      scale: 1,
      rotateX: 0,
      transition: {
        type: "spring",
        stiffness: 1000, // Much higher for snappier movement
        damping: 50, // Balanced damping for minimal oscillation
        mass: 0.2, // Lower mass for faster reaction
        restSpeed: 0.01, // Lower rest speed for more precise settling
        restDelta: 0.01,
      },
    },
    exit: {
      y: -100, // Reduced travel distance
      opacity: 0,
      scale: 0.95,
      rotateX: -15,
      transition: {
        type: "spring",
        stiffness: 1000,
        damping: 50,
        mass: 0.2,
        restSpeed: 0.01,
        restDelta: 0.01,
        opacity: {
          duration: 0.1, // Faster fade out
        },
      },
    },
  };

  if (isLoading) return <LoaderFlag />;

  return (
    <div>
      <Box>
        <div className={styles.statementsHeading}>
          <h3>
            Comments{" "}
            <Badge size="small" theme="blue">
              {statements.length}
            </Badge>
          </h3>

          <Select
            name="sort"
            backgroundColor="blue"
            options={[
              { label: "Suggested", value: "populist" },
              { label: "Newest", value: "newest" },
              { label: "Oldest", value: "oldest" },
              { label: "Most supported", value: "most-supported" },
              { label: "Least supported", value: "least-supported" },
              { label: "Most opposed", value: "most-opposed" },
              { label: "Least opposed", value: "least-opposed" },
              { label: "Most neutral", value: "most-neutral" },
            ]}
          />
        </div>
        <Divider />
        {!!currentStatement && (
          <div className={styles.stack}>
            {/* Placeholder statement */}
            <div
              className={styles.statement}
              style={{
                backgroundColor: "transparent",
                position: "absolute",
                width: "100%",
                height: "100%",
                top: 0,
                left: 0,
              }}
            />

            {/* Animated statement */}
            <div style={{ position: "relative", zIndex: 1 }}>
              <AnimatePresence mode="wait" initial={false}>
                {animate && currentStatement && (
                  <motion.div
                    key={getAnimationKey(currentStatementIndex)}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    variants={slideVariants}
                    style={{ transformOrigin: "center center" }}
                  >
                    <StatementBox
                      statement={currentStatement}
                      handleVote={handleVote}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
        <div>
          <div
            className={styles.statementInfo}
            style={{ color: "var(--aqua)" }}
          >
            <div className={styles.flexBetween}>
              <span>
                <BiInfoCircle size={25} color="var(--aqua)" />
              </span>
              <p>
                Add your unique perspective or experience in the box below. Your
                statement should:
              </p>
            </div>

            <ul>
              <li>Present one clear, standalone idea</li>
              <li>Bring fresh insights to the discussion</li>
              <li>Be concise (140 characters max)</li>
            </ul>
          </div>
          <form
            className={clsx(styles.formContainer)}
            onSubmit={handleSubmit(handleNewStatement)}
          >
            <div className={styles.flexBetween}>
              <Avatar
                src={
                  user?.userProfile.profilePictureUrl ||
                  PERSON_FALLBACK_IMAGE_400_URL
                }
                alt="profile picture"
                size={35}
              />
              <TextInput
                name="statement"
                placeholder="Enter your statement here"
                register={register}
                control={control}
                size="small"
              />
            </div>
            <Button size="medium" label="Submit" />
          </form>
          {relatedStatementsLoading && (
            <div className={styles.centered}>
              <span className={styles.noResults} style={{ margin: "1rem 0" }}>
                Loading related statements...
              </span>
            </div>
          )}
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
        </div>
      </Box>
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
  if (!statement) return null;
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

      <div className={styles.voteOptions}>
        <Badge
          size="responsive"
          clickable
          iconLeft={<FaCheckCircle size={18} color="var(--green-support)" />}
          onClick={() => handleVote(statement.id, ArgumentPosition.Support)}
        >
          Support
        </Badge>
        <Badge
          size="responsive"
          clickable
          iconLeft={<RiCloseCircleFill size={18} color="var(--red)" />}
          onClick={() => handleVote(statement.id, ArgumentPosition.Oppose)}
        >
          Oppose
        </Badge>
        <Badge
          size="responsive"
          clickable
          iconLeft={<BsEmojiNeutral />}
          onClick={() => handleVote(statement.id, ArgumentPosition.Neutral)}
        >
          Neutral
        </Badge>
      </div>
    </div>
  );
}
