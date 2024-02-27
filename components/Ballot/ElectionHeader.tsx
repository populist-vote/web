import {
  ElectionResult,
  useElectionVotingGuideByUserIdQuery,
  useUpsertVotingGuideMutation,
} from "generated";
import styles from "./Ballot.module.scss";
import { dateString } from "utils/dates";
import { useVotingGuide } from "hooks/useVotingGuide";
import { Button } from "components/Button/Button";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "hooks/useAuth";
import { Badge } from "components/Badge/Badge";
import { BiStar } from "react-icons/bi";
import { useRouter } from "next/router";

function ElectionHeader({ election }: { election: Partial<ElectionResult> }) {
  const { data: votingGuide } = useVotingGuide();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const createVotingGuide = useUpsertVotingGuideMutation();
  const router = useRouter();

  const handleVotingGuideCreate = () => {
    createVotingGuide.mutate(
      {
        electionId: election.id as string,
      },
      {
        onSuccess: (data) => {
          void queryClient.invalidateQueries({
            queryKey: useElectionVotingGuideByUserIdQuery.getKey({
              userId: user?.id,
              electionId: election.id as string,
            }),
          });
          if (router.pathname.includes("/voting-guides"))
            void router.push(`/voting-guides/${data.upsertVotingGuide.id}`);
        },
      }
    );
  };

  return (
    <div className={styles.electionHeader}>
      {election.electionDate && (
        <h1>{dateString(election.electionDate, true)}</h1>
      )}
      {election.title && <h4>{election.title}</h4>}
      <p>{election.description}</p>
      {votingGuide ? (
        <Badge theme="yellow">
          <BiStar color="var(--yellow)" size={25} />
          Click the plus signs to star the candidates you support, add notes,
          and share your voting guide for this election
        </Badge>
      ) : (
        <Button
          size="small"
          variant="primary"
          label="Create a Voting Guide for this Election"
          onClick={handleVotingGuideCreate}
          disabled={createVotingGuide.isPending}
        />
      )}
    </div>
  );
}

export { ElectionHeader };
