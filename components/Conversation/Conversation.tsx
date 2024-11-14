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
import { SearchInput } from "components/SearchInput/SearchInput";
import { Button } from "components/Button/Button";
import { PERSON_FALLBACK_IMAGE_400_URL } from "utils/constants";
import { useAuth } from "hooks/useAuth";
import { Avatar } from "components/Avatar/Avatar";
import { Select } from "components/Select/Select";
import {
  ArgumentPosition,
  useAddStatementToConversationMutation,
  useConversationByIdQuery,
  useVoteOnStatementMutation,
} from "generated";
import { LoaderFlag } from "components/LoaderFlag/LoaderFlag";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useState } from "react";

export function Conversation({ id }: { id: string }) {
  const { user } = useAuth();
  const { register, control, handleSubmit, reset } = useForm();

  const { data, isLoading } = useConversationByIdQuery({ id });

  const addStatementMutation = useAddStatementToConversationMutation();
  const voteOnStatementMutation = useVoteOnStatementMutation();
  const queryClient = useQueryClient();

  const handleNewStatement = async (data: any) => {
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

  const handleVote = async (statementId: string, vote: ArgumentPosition) => {
    try {
      await voteOnStatementMutation.mutateAsync({
        statementId,
        voteType: vote,
      });
      await queryClient.invalidateQueries({
        queryKey: useConversationByIdQuery.getKey({ id }),
      });
      toast.success("Your vote has been submitted!");
      handleShowNextStatement();
    } catch (error) {
      toast.error("Failed to submit vote");
    }
  };

  const [currentStatementIndex, setCurrentStatementIndex] = useState(0);
  const handleShowNextStatement = () => {
    setCurrentStatementIndex((prev) => prev + 1);
  };

  const statements = data?.conversationById?.statements || [];

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
          <div style={{ width: "24rem", display: "flex", gap: "1rem" }}>
            <SearchInput
              searchId="searchComments"
              placeholder="Search comments"
            />
            <Select
              name="sort"
              backgroundColor="blue"
              options={[
                { label: "Populist suggested", value: "populist" },
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
        </div>
        <Divider />
        {statements
          .slice(currentStatementIndex, currentStatementIndex + 1)
          .map((statement) => (
            <div key={statement.id} className={styles.stack}>
              <div className={styles.statement}>
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
                <p>{statement.content}</p>
                <div className={styles.statementFooter}>
                  <div
                    className={styles.flexLeft}
                    style={{ width: "10rem", color: "var(--blue-text-light)" }}
                  >
                    <small>
                      {new Date(statement.createdAt).toLocaleString()}
                    </small>
                  </div>
                  <div className={styles.flexRight}>
                    <Badge
                      clickable
                      iconLeft={
                        <FaCheckCircle size={18} color="var(--green-support)" />
                      }
                      onClick={() =>
                        handleVote(statement.id, ArgumentPosition.Support)
                      }
                    >
                      Support
                    </Badge>
                    <Badge
                      clickable
                      iconLeft={
                        <RiCloseCircleFill size={18} color="var(--red)" />
                      }
                      onClick={() =>
                        handleVote(statement.id, ArgumentPosition.Oppose)
                      }
                    >
                      Oppose
                    </Badge>
                    <Badge
                      clickable
                      iconLeft={<BsEmojiNeutral />}
                      onClick={() =>
                        handleVote(statement.id, ArgumentPosition.Neutral)
                      }
                    >
                      Neutral
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          ))}
        <div>
          <div className={styles.statementInfo}>
            <span>
              <BiInfoCircle size={25} color="var(--aqua)" />
            </span>
            <p>Add your unique perspective or experience in the box below.</p>

            <p>Your statement should:</p>
            <ul>
              <li>Present one clear, standalone idea</li>
              <li>Bring fresh insights to the discussion</li>
              <li>Be concise (140 characters max)</li>
            </ul>
          </div>
          <form
            className={styles.flexBetween}
            onSubmit={handleSubmit(handleNewStatement)}
          >
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
            <Button size="medium" label="Submit" />
          </form>
        </div>
      </Box>
    </div>
  );
}
