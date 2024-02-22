import { Bill } from "generated";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import styles from "./BillVotes.module.scss";
import { PieChart } from "react-minimal-pie-chart";

export function BillVotes({ votes }: { votes: Bill["votes"] }) {
  if (votes.length < 1) return null;

  const lastHouseVote = votes
    ?.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .filter((vote) => vote.chamber === "H")
    .slice(-1)
    .pop();
  const lastSenateVote = votes
    ?.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .filter((vote) => vote.chamber === "S")
    .slice(-1)
    .pop();

  return (
    <div className={styles.container}>
      {lastHouseVote && (
        <div className={styles.chamberVote}>
          <h4>House Vote</h4>
          <div className={styles.pieChartContainer}>
            <PieChart
              data={[
                {
                  title: "Yea",
                  value: lastHouseVote?.yea as number,
                  color: "var(--green-support)",
                },
                {
                  title: "Nay",
                  value: lastHouseVote?.nay as number,
                  color: "var(--red)",
                },
              ]}
              lineWidth={22}
              style={{ height: "80px" }}
              className={styles.pieChart}
            />
            <div className={styles.votes}>
              <div className={styles.vote}>
                <FaCheckCircle size={13} color="var(--green-support)" />
                <span>{lastHouseVote?.yea}</span>
              </div>
              <div className={styles.vote}>
                <FaTimesCircle size={13} color="var(--red)" />
                <span>{lastHouseVote?.nay}</span>
              </div>
            </div>
          </div>
        </div>
      )}
      {lastSenateVote && (
        <div className={styles.chamberVote}>
          <h4>Senate Vote</h4>
          <div className={styles.pieChartContainer}>
            <PieChart
              data={[
                {
                  title: "Yea",
                  value: lastSenateVote?.yea as number,
                  color: "var(--green-support)",
                },
                {
                  title: "Nay",
                  value: lastSenateVote?.nay as number,
                  color: "var(--red)",
                },
              ]}
              lineWidth={22}
              style={{ height: "80px" }}
              className={styles.pieChart}
            />
            <div className={styles.votes}>
              <div className={styles.vote}>
                <FaCheckCircle size={13} color="var(--green-support)" />
                <span>{lastSenateVote?.yea}</span>
              </div>
              <div className={styles.vote}>
                <FaTimesCircle size={13} color="var(--red)" />
                <span>{lastSenateVote?.nay}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
