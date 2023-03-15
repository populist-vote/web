import Link from "next/link";
import { TopNav } from "components";

type ElectionTab = "Ballot" | "VotingGuide";

function TopNavElections({ selected }: { selected: ElectionTab }) {
  return (
    <TopNav>
      <ul>
        <li data-selected={selected === "Ballot"}>
          <Link href="/ballot">My Ballot</Link>
        </li>
        <li data-selected={selected === "VotingGuide"}>
          <Link href="/voting-guides">Voting Guides</Link>
        </li>
      </ul>
    </TopNav>
  );
}

export { TopNavElections };
