import styles from "./BetaNotice.module.scss";
import { Button } from "components/Button/Button";
import { useMediaQuery } from "hooks/useMediaQuery";

function BetaNotice({ onContinue }: { onContinue: () => void }) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  return (
    <div className={styles.noticeContainer}>
      <div className={styles.roundedCard}>
        <h2>We’re still in beta.</h2>
        <p>
          Populist currently only supports Colorado and Minnesota election
          information - if you live outside of these states stay tuned as we
          expand into the rest of the United States.
        </p>
        <div className={styles.buttonWrapper}>
          <Button
            onClick={() => onContinue()}
            label="Continue"
            size={isMobile ? "small" : "large"}
            variant="primary"
          />
        </div>
      </div>
    </div>
  );
}

export { BetaNotice };
