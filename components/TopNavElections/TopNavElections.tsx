import Link from "next/link";
import { TopNav, ElectionSelector } from "components";
import { useElections } from "hooks/useElections";

import { ElectionResult } from "generated";

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
    error,
    selectedElectionId,
    setSelectedElectionId,
  } = useElections();

  console.log({ showElectionSelector });
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
          <li>
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
