import Link from "next/link";
import { TopNav, ElectionSelector } from "components";
import { useElectionsOutput } from "hooks/useElections";
import { ElectionResult } from "generated";
import styles from "./TopNavElections.module.scss";

type ElectionTab = "Ballot" | "VotingGuide";

function TopNavElections({
  selected,
  showElectionSelector = false,
  electionData,
}: {
  selected: ElectionTab;
  showElectionSelector?: boolean;
  electionData?: useElectionsOutput;
}) {
  const {
    data,
    isLoading,
    isSuccess,
    selectedElectionId,
    setSelectedElectionId,
  } = electionData || {};

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
            {isSuccess && setSelectedElectionId && (
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
