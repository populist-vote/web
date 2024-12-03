import styles from "./OpinionGroupScatterChart.module.scss";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

function OpinionGroupScatterChart({
  opinionGroups,
}: {
  opinionGroups: OpinionGroup[];
}) {
  const transformedData = opinionGroups.map((group) => {
    return {
      id: group.id,
      data: group.characteristicVotes.map((vote) => ({
        x: vote.meanSentiment,
        y: vote.consensusLevel,
        z: 1,
        statementId: vote.statementId,
      })),
    };
  });

  const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#d88484"];

  const CustomTooltip = ({
    active,
    payload,
  }: {
    active?: boolean;
    payload: any[];
  }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className={styles.tooltip}>
          <p className={styles.title}>Statement ID: {data.statementId}</p>
          <p>Sentiment: {data.x.toFixed(2)}</p>
          <p>Consensus: {(data.y * 100).toFixed(1)}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={styles.container}>
      <ScatterChart
        width={730}
        height={500}
        margin={{
          top: 20,
          right: 20,
          bottom: 60, // Increased bottom margin
          left: 40,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          type="number"
          dataKey="x"
          name="Sentiment"
          domain={[-1, 1]}
          tick={{ fontSize: 12 }}
          label={{ value: "Sentiment", position: "bottom", offset: 5 }}
        />
        <YAxis
          type="number"
          dataKey="y"
          name="Consensus"
          domain={[0, 1]}
          tick={{ fontSize: 12 }}
          label={{
            value: "Consensus",
            angle: -90,
            position: "insideLeft",
            offset: 10,
          }}
        />
        <ZAxis type="number" dataKey="z" range={[100, 200]} name="size" />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          verticalAlign="bottom"
          height={36} // Explicit height for legend
          wrapperStyle={{
            paddingTop: "1rem", // Add padding above legend
            bottom: 0, // Align to bottom
          }}
        />
        {transformedData.map((group, index) => (
          <Scatter
            key={group.id}
            name={`Opinion Group ${parseInt(group.id) + 1}`}
            data={group.data}
            fill={colors[index % colors.length]}
          />
        ))}
      </ScatterChart>
      {/* 
      <div className={styles.legendContainer}>
        <div className={styles.legendBox}>
          <h3>How to Read This Chart</h3>
          <p>• X-axis shows sentiment from -1 (oppose) to 1 (support)</p>
          <p>• Y-axis shows consensus level from 0 to 1</p>
          <p>• Each point represents one statement</p>
          <p>• Colors represent different opinion groups</p>
        </div>
        <div className={styles.legendBox}>
          <h3>What to Look For</h3>
          <p>• Clusters of points show similar opinions</p>
          <p>• Higher points show stronger consensus</p>
          <p>• Left/right position shows support/opposition</p>
        </div>
      </div> */}
    </div>
  );
}

export default OpinionGroupScatterChart;
