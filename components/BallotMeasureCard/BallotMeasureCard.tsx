import { BallotMeasureResult } from "generated";
import styles from "./BallotMeasureCard.module.scss";
import { Badge } from "components/Badge/Badge";
import { FaCheckCircle } from "react-icons/fa";
import { RiCloseCircleFill } from "react-icons/ri";

export function BallotMeasureCard({
  measure,
}: {
  measure: Partial<BallotMeasureResult>;
}) {
  return (
    <div className={styles.billCard}>
      <header className={styles.header}>
        <strong>{`${measure.state} - ${measure.ballotMeasureCode}`}</strong>
        <strong>2024</strong>
      </header>
      <div className={styles.cardContent}>
        <h2 className={styles.title}>{measure.title}</h2>
        <p className={styles.description}>{measure.description}</p>
        <div className={styles.votes}>
          <Badge
            iconLeft={<FaCheckCircle size={18} color="var(--green-support)" />}
          >
            YES
          </Badge>
          <Badge iconLeft={<RiCloseCircleFill size={18} color="var(--red)" />}>
            NO
          </Badge>
        </div>
      </div>
    </div>
  );
}
