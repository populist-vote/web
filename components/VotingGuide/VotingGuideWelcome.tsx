import { Button, BasicLayout, TopNavElections } from "components";
import styles from "./VotingGuideWelcome.module.scss";
import clsx from "clsx";
import { ReactNode } from "react";
import { Box } from "components/Box/Box";

function VotingGuideWelcome({ onClose }: { onClose: () => void }) {
  return (
    <>
      <TopNavElections selected="Ballot" />

      <section className={clsx(styles.content)}>
        <Box>
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
        </Box>
      </section>
    </>
  );
}

VotingGuideWelcome.getLayout = (page: ReactNode) => (
  <BasicLayout>{page}</BasicLayout>
);

export { VotingGuideWelcome };
