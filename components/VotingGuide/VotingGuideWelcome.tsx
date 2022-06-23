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
            Endorse and commment on candidates running for local offices to
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
