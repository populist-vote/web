import { useState } from "react";
import { BasicLayout, HomePageButton, SEO, BetaNotice } from "components";
import { BETA_NOTICE_VISIBLE } from "utils/constants";
import { useAuth } from "hooks/useAuth";

function HomePage() {
  const user = useAuth({ redirect: false });

  const userId = user?.id;

  const [isBetaVisible, setIsBetaVisible] = useState(
    localStorage.getItem(`${BETA_NOTICE_VISIBLE}-${userId}`) !== "false"
  );

  const handleBetaDismissal = () => {
    setIsBetaVisible(false);
    localStorage.setItem(`${BETA_NOTICE_VISIBLE}-${userId}`, "false");
  };

  return (
    <>
      <SEO
        title="Home"
        description="Find information on your government representatives like voting histories, endorsements, and financial data."
      />
      <BasicLayout showAuthButtons>
        {isBetaVisible ? (
          <BetaNotice onContinue={handleBetaDismissal} />
        ) : (
          <>
            <HomePageButton
              href="/ballot/choose"
              className="myBallot"
              label="My Ballot"
            />
            <HomePageButton
              href="/voting-guides"
              className="votingGuides"
              label="Voting Guides"
            />
            <HomePageButton
              href="/politicians"
              className="myLegislators"
              label="Browse"
            />
          </>
        )}
      </BasicLayout>
    </>
  );
}

export default HomePage;
