import BasicLayout from "components/BasicLayout/BasicLayout";
import Button from "components/Button";
import styles from "styles/page.module.scss";

export function VotingGuideWelcome({ onClose }: { onClose: () => void }) {
  return (
    <BasicLayout>
      <div className={styles.container}>
        <section className={styles.center}>
          <h1>Create A Voting Guide</h1>
          <p>
            Adding a note or endorsing a candidate saves them to a personalized
            voting guide that can be easily shared with your friends.
          </p>
          <Button
            id="voting-guide-welcome-close-btn"
            label="close"
            theme="blue"
            variant="primary"
            size="large"
            onClick={onClose}
          >
            Close
          </Button>
        </section>
      </div>
    </BasicLayout>
  );
}
