import BasicLayout from "components/BasicLayout/BasicLayout";
import { HomePageButton } from "components/HomePageButton/HomePageButton";
import Head from "next/head";

function HomePage() {
  return (
    <>
      <Head>
        <title>Populist - Home</title>
        <meta
          name="description"
          content="Find information on your government representatives like voting histories, endorsements, and financial data."
        />
      </Head>
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
