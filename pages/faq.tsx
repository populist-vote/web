import BasicLayout from "components/BasicLayout/BasicLayout";
import { NextPage } from "next";
import styles from "../components/BasicLayout/BasicLayout.module.scss";

export const FaqPage: NextPage = () => {
  return (
    <BasicLayout>
      <div className={styles.alignLeft}>
        <h1>Frequently Asked Questions</h1>
        <h2>What is Populist?</h2>
        <p>
          Populist is a platform for civic engagement built on transparently
          sourced data.
        </p>
        <h2 id="no-google-fb-login">
          Why can't I sign in with Google or Facebook?
        </h2>
        <p>
          We want you to own your data. When you register for websites and apps
          with Facebook and Google, you are agreeing to have your behavior on
          the web tracked and ingested to serve the purposes of these
          corporations advertising engines.
        </p>
        <p>
          At Populist, we will never sell your data and you can expect our
          platform to remain ad free for the forseeable future.
        </p>
        <h2>How was Populist built?</h2>
        <p>
          All of our code is open source and available{" "}
          <a
            className={styles.textLink}
            href="https://github.com/populist-vote"
          >
            on GitHub.
          </a>{" "}
          We encourage you to join our community and help us in building a
          stronger democracy through public civic engagement. If you're
          interested in contributing, get in touch! Someone on our team would be
          happy to help you get up and running with our applications.
        </p>
      </div>
    </BasicLayout>
  );
};

export default FaqPage;
