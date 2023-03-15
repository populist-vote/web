import { Button, BasicLayout, TopNavElections } from "components";
import styles from "styles/modules/page.module.scss";
import VotingGuideWelcomeStyles from "./VotingGuideWelcome.module.scss";
import clsx from "clsx";
import { ReactNode } from "react";

function VotingGuideWelcome({ onClose }: { onClose: () => void }) {
  return (
    <>
      <TopNavElections selected="VotingGuide" />
      <div className={styles.container}>
        <section
          className={clsx(styles.center, VotingGuideWelcomeStyles.content)}
        >
          <h1>Create A Voting Guide</h1>
          <p>
            Endorse and comment on candidates running for local offices to
            create a personalized voting guide that you can share with your
            community.
          </p>
          <Button
            id="voting-guide-welcome-close-btn"
            label="close"
            theme="blue"
            variant="primary"
            size="large"
            onClick={onClose}
          />
        </section>
      </div>
    </>
  );
}

VotingGuideWelcome.getLayout = (page: ReactNode) => (
  <BasicLayout>{page}</BasicLayout>
);

export { VotingGuideWelcome };
