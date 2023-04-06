import { Bill } from "generated";
import { FaCheckCircle } from "react-icons/fa";
import { RiCloseCircleFill } from "react-icons/ri";
import styles from "./LastVoteSection.module.scss";
import { PieChart } from "react-minimal-pie-chart";

function LastVoteSection({ votes }: { votes: Bill["votes"] }) {
  if (votes.length < 1) return null;

  const lastHouseVote = votes
    ?.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .find((vote) => vote.chamber === "H");
  const lastSenateVote = votes
    ?.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .find((vote) => vote.chamber === "S");

  return (
    <div className={styles.container}>
      <div>
        <h4>House</h4>
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
            lineWidth={20}
            style={{ height: "100px" }}
            className={styles.pieChart}
          />
          <div className={styles.votes}>
            <div className={styles.vote}>
              <FaCheckCircle size={12} color="var(--green-support)" />
              <span>{lastHouseVote?.yea}</span>
            </div>
            <div className={styles.vote}>
              <RiCloseCircleFill size={12} color="var(--red)" />
              <span>{lastHouseVote?.nay}</span>
            </div>
          </div>
        </div>
      </div>
      <div>
        <h4>Senate</h4>
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
            lineWidth={20}
            style={{ height: "100px" }}
            className={styles.pieChart}
          />
          <div className={styles.votes}>
            <div className={styles.vote}>
              <FaCheckCircle size={12} color="var(--green-support)" />
              <span>{lastSenateVote?.yea}</span>
            </div>
            <div className={styles.vote}>
              <RiCloseCircleFill size={12} color="var(--red)" />
              <span>{lastSenateVote?.nay}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { LastVoteSection };
