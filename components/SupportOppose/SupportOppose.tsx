import { useMemo, CSSProperties } from "react";
import { FaCheck, FaTimes } from "react-icons/fa";
import { addAlphaToHexColor } from "utils/strings";
import useDocumentBaseStyle from "hooks/useDocumentBaseStyle";
import {
  ArgumentPosition,
  PublicVotes,
  useBillBySlugQuery,
  useUpsertBillPublicVoteMutation,
} from "generated";
import styles from "./SupportOppose.module.scss";
import { useAuth } from "hooks/useAuth";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";

interface SupportOpposeActionProps {
  type: ArgumentPosition;
  selected?: boolean;
  votes: number;
  toggle: () => void;
}

function SupportOpposeAction({
  type,
  selected = false,
  votes,
  toggle,
}: SupportOpposeActionProps) {
  const Icon = type === ArgumentPosition.Support ? FaCheck : FaTimes;
  const style = useDocumentBaseStyle();
  const color = type === ArgumentPosition.Support ? "--green-support" : "--red";
  const rawColor = useMemo(() => style.getPropertyValue(color), [color, style]);

  const styleVars: CSSProperties & {
    "--action-color": string;
    "--action-background-color": string;
    "--icon-background-color": string;
    "--icon-border-color": string;
  } = {
    [`--action-color`]: `var(${color})`,
    [`--action-background-color`]: selected
      ? addAlphaToHexColor(
          rawColor,
          type === ArgumentPosition.Support ? 0.1 : 0.2
        )
      : "none",
    [`--icon-background-color`]: selected ? `var(${color})` : "none",
    [`--icon-border-color`]: selected ? `var(${color})` : "var(--blue)",
  };

  return (
    <button className={styles.action} style={styleVars} onClick={toggle}>
      <div className={styles.actionInner}>
        <div className={styles.votesContainer}>
          <span className={styles.iconWrapper}>
            <Icon size="1.825rem" />
          </span>
          <span className={styles.votes}>{votes}</span>
        </div>
        <div className={styles.actionText}>
          {type === ArgumentPosition.Support ? "Support" : "Oppose"}
        </div>
      </div>
    </button>
  );
}

function SupportOppose({
  billId,
  billSlug,
  publicVotes,
  usersVote,
}: {
  billId: string;
  billSlug: string;
  publicVotes: PublicVotes;
  usersVote: ArgumentPosition | null | undefined;
}) {
  const { support: supportVotes, oppose: opposeVotes } = publicVotes;
  const router = useRouter();
  const queryKey = useBillBySlugQuery.getKey({ slug: billSlug });
  const { user } = useAuth({ redirect: false });

  const queryClient = useQueryClient();
  const upsertPublicVotesMutation = useUpsertBillPublicVoteMutation({
    onMutate: async (variables) => {
      await queryClient.cancelQueries(queryKey);
      const previousValue = queryClient.getQueryData(queryKey);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      queryClient.setQueryData(queryKey, (oldData: any) => {
        const newPublicVotes = {
          ...oldData?.publicVotes,
          [variables.position.toLowerCase()]:
            oldData.billBySlug.publicVotes[variables.position.toLowerCase()] +
            1,
          [usersVote as string]:
            oldData.billBySlug.publicVotes[usersVote as string] - 1,
        };
        return {
          ...oldData,
          publicVotes: newPublicVotes,
          usersVote: variables.position,
        };
      });
      return { previousValue };
    },
    onError: (_err, _variables, context) => {
      queryClient.setQueryData(queryKey, context?.previousValue);
    },
    onSettled: () => {
      void queryClient.invalidateQueries(queryKey);
    },
  });

  const toggleSupport = () => {
    if (!user) void router.push("/login");
    if (user) {
      upsertPublicVotesMutation.mutate({
        billId,
        userId: user.id,
        position:
          usersVote === ArgumentPosition.Support
            ? ArgumentPosition.Neutral
            : ArgumentPosition.Support,
      });
    }
  };

  const toggleOppose = () => {
    if (!user) void router.push("/login");
    if (user) {
      upsertPublicVotesMutation.mutate({
        billId,
        userId: user.id,
        position:
          usersVote === ArgumentPosition.Oppose
            ? ArgumentPosition.Neutral
            : ArgumentPosition.Oppose,
      });
    }
  };

  return (
    <div className={styles.container}>
      <SupportOpposeAction
        type={ArgumentPosition.Support}
        selected={usersVote === ArgumentPosition.Support}
        votes={supportVotes as number}
        toggle={toggleSupport}
      />
      <SupportOpposeAction
        type={ArgumentPosition.Oppose}
        selected={usersVote === ArgumentPosition.Oppose}
        votes={opposeVotes as number}
        toggle={toggleOppose}
      />
    </div>
  );
}

export { SupportOppose };
