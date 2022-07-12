import { BasicLayout, HomePageButton, SEO } from "components";

function HomePage() {
  return (
    <>
      <SEO
        title="Home"
        description="Find information on your government representatives like voting histories, endorsements, and financial data."
      />
      <BasicLayout>
        <HomePageButton href="/ballot" className="myBallot" label="My Ballot" />
        <HomePageButton
          href="/voting-guides"
          className="votingGuides"
          label="Voting Guides"
        />
        <HomePageButton
          href="/politicians"
          className="myLegislators"
          label="Colorado Legislators"
        />
      </BasicLayout>
    </>
  );
}

export default HomePage;
