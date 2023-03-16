import Link from "next/link";
import { TopNav, ElectionSelector } from "components";
import { useElections } from "hooks/useElections";
import { ElectionResult } from "generated";
import styles from "./TopNavElections.module.scss";

type ElectionTab = "Ballot" | "VotingGuide";

function TopNavElections({
  selected,
  showElectionSelector = false,
}: {
  selected: ElectionTab;
  showElectionSelector?: boolean;
}) {
  const {
    data,
    isLoading,
    isSuccess,
    selectedElectionId,
    setSelectedElectionId,
  } = useElections();

  return (
    <TopNav>
      <ul>
        <li data-selected={selected === "Ballot"}>
          <Link href="/ballot">My Ballot</Link>
        </li>
        <li data-selected={selected === "VotingGuide"}>
          <Link href="/voting-guides">Voting Guides</Link>
        </li>
        {showElectionSelector && (
          <li className={styles.electionSelector}>
            {isLoading && "..."}
            {isSuccess && (
              <ElectionSelector
                elections={
                  data?.electionsByUserState as Partial<ElectionResult>[]
                }
                selectedElectionId={selectedElectionId as string}
                setSelectedElectionId={setSelectedElectionId}
              />
            )}
          </li>
        )}
      </ul>
    </TopNav>
  );
}

export { TopNavElections };
