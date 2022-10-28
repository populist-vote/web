import { useState } from "react";
import { BasicLayout, HomePageButton, BetaNotice } from "components";
import { BETA_NOTICE_VISIBLE } from "utils/constants";
import { useAuth } from "hooks/useAuth";

export function getServerSideProps() {
  return {
    props: {
      title: "Home",
    },
  };
}

function HomePage() {
  const user = useAuth({ redirect: false });

  const userId = user?.id;

  const [isBetaVisible, setIsBetaVisible] = useState(
    localStorage.getItem(`${BETA_NOTICE_VISIBLE}-${userId || "incognito"}`) !==
      "false"
  );

  const handleBetaDismissal = () => {
    setIsBetaVisible(false);
    localStorage.setItem(
      `${BETA_NOTICE_VISIBLE}-${userId || "incognito"}`,
      "false"
    );
  };

  return (
    <BasicLayout showAuthButtons>
      {isBetaVisible ? (
        <BetaNotice onContinue={handleBetaDismissal} />
      ) : (
        <div>
          <HomePageButton
            href={user ? "/ballot" : "/ballot/choose"}
            className="myBallot"
            label="My Ballot"
          />
          <HomePageButton
            href={user ? "/voting-guides" : "/login?next=/voting-guides"}
            className="votingGuides"
            label="Voting Guides"
          />
          <HomePageButton
            href="/politicians"
            className="myLegislators"
            label="Browse Politicians"
          />
        </div>
      )}
    </BasicLayout>
  );
}

export default HomePage;
