import BasicLayout from "components/BasicLayout/BasicLayout";
import Button from "components/Button";
import styles from "styles/page.module.scss";
import VotingGuideWelcomeStyles from "./VotingGuideWelcome.module.scss";
import classNames from "classnames";

export function VotingGuideWelcome({ onClose }: { onClose: () => void }) {
  return (
    <BasicLayout>
      <div className={styles.container}>
        <section className={classNames(styles.center, VotingGuideWelcomeStyles.content)}>
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
