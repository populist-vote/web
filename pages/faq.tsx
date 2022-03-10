import BasicLayout from "components/BasicLayout/BasicaLayout";
import { NextPage } from "next";

export const FaqPage: NextPage = () => {
  return (
    <BasicLayout>
      <h1>Frequently Asked Questions</h1>
      <h2>What is this?</h2>
      <p>Something incredible. A new world of civic engagement.</p>
      <h2>Why can't I sign in with Google or Facebook?</h2>
      <p>
        We want you to own your data. When you register for websites and apps
        with Facebook and Google, you are agreeing to have your behavior on the
        web tracked and ingested to serve the purposes of these corporations
        advertising engines.
      </p>
      <p>
        At Populist, we will never sell your data and you can expect our
        platform to remain ad free for the foreseaable future.
      </p>
      <h2>How was Populist built?</h2>
      <p>
        All of our code is open source and available{" "}
        <a href="https://github.com/populist-vote">on GitHub.</a> We encourage
        you to join our community and help us in building a stronger democracy
        through public civic engagement. If you're interested in contributing,
        get in touch! Someone on our team would be happy to help you get up and
        running with our applications.
      </p>
    </BasicLayout>
  );
};

export default FaqPage;
