import { Button, BasicLayout } from "components";
import styles from "styles/modules/page.module.scss";
import VotingGuideWelcomeStyles from "./VotingGuideWelcome.module.scss";
import classNames from "classnames";

function VotingGuideWelcome({ onClose }: { onClose: () => void }) {
  return (
    <BasicLayout>
      <div className={styles.container}>
        <section
          className={classNames(
            styles.center,
            VotingGuideWelcomeStyles.content
          )}
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
    </BasicLayout>
  );
}

export { VotingGuideWelcome };
