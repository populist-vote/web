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
    </BasicLayout>
  );
};

export default FaqPage;
