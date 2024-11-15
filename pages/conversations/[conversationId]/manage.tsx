import { Badge, Box, Divider, Layout, LoaderFlag, Select } from "components";
import {
  ConversationResult,
  useConversationAnalyticsQuery,
  VoteDistributionBucket,
} from "generated";
import { GetServerSideProps } from "next";
import nextI18nextConfig from "next-i18next.config";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { ReactNode, useState } from "react";
import { SupportedLocale } from "types/global";
import styles from "components/Dashboard/Dashboard.module.scss";
import { CountOverTimeLineChart } from "components/PollMetrics/PollMetrics";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const locale = ctx.locale as SupportedLocale;
  return {
    props: {
      ...(await serverSideTranslations(
        locale,
        ["auth", "common"],
        nextI18nextConfig
      )),
    },
  };
};

export default function ConversationManagePage() {
  const [interval, setInterval] = useState<"hour" | "day" | "week">("hour");
  const { conversationId } = useRouter().query as { conversationId: string };
  const { data, isLoading } = useConversationAnalyticsQuery({
    conversationId,
    interval: `1 ${interval}`,
  });

  const conversation = data?.conversationById as ConversationResult;

  if (isLoading) return <LoaderFlag />;

  return (
    <div className={styles.container}>
      <h1>{conversation.topic}</h1>
      <p style={{ margin: 0 }}>{conversation.description}</p>
      <Divider />

      <div className={styles.tiles}>
        <Box>
          <div className={styles.tile}>
            <h1>{conversation.stats.totalParticipants}</h1>
            <h4 style={{ color: `var(--salmon)` }}>Participants</h4>
          </div>
        </Box>
        <Box>
          <div className={styles.tile}>
            <h1>{conversation.stats.totalStatements}</h1>
            <h4 style={{ color: `var(--yellow)` }}>Statements</h4>
          </div>
        </Box>
        <Box>
          <div className={styles.tile}>
            <h1>{conversation.stats.totalVotes}</h1>
            <h4 style={{ color: `var(--aqua)` }}>Votes</h4>
          </div>
        </Box>
      </div>
      <Divider />
      <div className={styles.flexRight}>
        <label htmlFor="interval">Interval</label>
        <Select
          name="interval"
          backgroundColor="blue"
          value={interval}
          onChange={(e) => {
            setInterval(e.target.value as "hour" | "day" | "week");
          }}
          options={[
            { value: "hour", label: "Hour" },
            { value: "day", label: "Day" },
            { value: "week", label: "Week" },
          ]}
        />
      </div>
      <Divider />
      <h4 style={{ color: "var(--salmon)" }}>Participants over time</h4>
      <CountOverTimeLineChart
        interval={interval}
        countByDate={
          data?.conversationById?.participationOverTime?.map((s) => {
            return {
              date: s.timestamp,
              count: s.count,
            };
          }) || []
        }
      />
      <Divider />
      <h4 style={{ color: "var(--yellow)" }}>Statements over time</h4>
      <CountOverTimeLineChart
        interval={interval}
        countByDate={
          data?.conversationById?.statementsOverTime.map((s) => {
            return {
              date: s.timestamp,
              count: s.count,
            };
          }) || []
        }
      />
      <Divider />
      <h4 style={{ color: "var(--aqua)" }}>Votes over time</h4>
      <CountOverTimeLineChart
        interval={interval}
        countByDate={
          data?.conversationById?.votesOverTime.map((s) => {
            return {
              date: s.timestamp,
              count: s.count,
            };
          }) || []
        }
      />

      <Divider />
      <h4>Vote distribution</h4>
      <VoteDistributionChart
        voteDistribution={data?.conversationById?.voteDistribution || []}
      />
    </div>
  );
}

ConversationManagePage.getLayout = (page: ReactNode) => <Layout>{page}</Layout>;

export function VoteDistributionChart({
  voteDistribution,
}: {
  voteDistribution: VoteDistributionBucket[];
}) {
  const sortedData = [...voteDistribution].sort(
    (a, b) => b.percentage - a.percentage
  );

  return (
    <div>
      {sortedData.map((result, index) => (
        <div key={index} className={styles.optionContainer}>
          <h5>
            {result.participantCount} participant
            {result.participantCount !== 1 ? "s" : ""}
          </h5>
          <div className={styles.barContainer}>
            <div
              className={styles.innerBar}
              style={{
                width: `${result.percentage}%`,
                backgroundColor: index === 0 ? "#006586" : "#004358",
              }}
            />
          </div>
          <Badge size="small" theme="violet">
            {result.voteCount} votes ({result.percentage}%)
          </Badge>
        </div>
      ))}
    </div>
  );
}
