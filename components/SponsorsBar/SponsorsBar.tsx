import { PoliticianResult } from "generated";
import styles from "./SponsorsBar.module.scss";

interface Props {
  endorsements: Partial<PoliticianResult>[];
}

function SponsorsBar({ endorsements }: Props) {
  const numDemocrats = endorsements.filter((e) =>
    e.party?.includes("DEMOCRATIC")
  ).length;

  const numRepublicans = endorsements.filter(
    (e) => e.party === "REPUBLICAN"
  ).length;

  const numEndorsements = endorsements.length;

  const democraticFr = Math.ceil((numDemocrats / numEndorsements) * 10);
  const republicanFr = Math.ceil((numRepublicans / numEndorsements) * 10);

  const styleVars = {
    "--democratic-fr": democraticFr > 0 ? `${democraticFr}fr` : "",
    "--republican-fr": republicanFr > 0 ? `${republicanFr}fr` : "",
  } as React.CSSProperties;

  return (
    <div className={styles.container} style={styleVars}>
      {numDemocrats > 0 && (
        <div className={styles.democratic}>
          <span>{numDemocrats}</span>Democratic
        </div>
      )}
      {numRepublicans > 0 && (
        <div className={styles.republican}>
          <span>{numRepublicans}</span>Republican
        </div>
      )}
    </div>
  );
}

export { SponsorsBar };
