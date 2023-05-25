import {
  PollResult,
  PollSubmissionResult,
  SubmissionsOverTimeResult,
} from "generated";
import styles from "./PollMetrics.module.scss";
import { useTheme } from "hooks/useTheme";
import { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { getMissingDates, getRelativeTimeString } from "utils/dates";
import { Table } from "components/Table/Table";
import { Box } from "components/Box/Box";
import { BsCircleFill } from "react-icons/bs";
import { XAxis, YAxis, AreaChart, Area, ResponsiveContainer } from "recharts";

export function SubmissionsOverTimeLineChart({
  submissionCountByDate,
}: {
  submissionCountByDate: SubmissionsOverTimeResult[];
}) {
  const dates = submissionCountByDate.map((submission) => submission.date);

  const missingDates = getMissingDates(dates);

  const missingDateCounts = missingDates.map((date) => ({
    date,
    count: 0,
  }));

  const counts = [...submissionCountByDate, ...missingDateCounts].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const data = counts.map((submission) => ({
    date: new Date(submission.date).toLocaleDateString(),
    count: submission.count,
  }));

  const renderCustomTick = ({
    x,
    y,
    payload,
  }: {
    x: number;
    y: number;
    payload: { value: string };
  }) => {
    return (
      <text
        x={x}
        y={y + 15}
        fontFamily="proxima_nova"
        fontSize={"14px"}
        fontWeight={500}
        fill="white"
        textAnchor="middle"
        dominantBaseline="middle"
      >
        {payload.value}
      </text>
    );
  };

  if (data.length === 0)
    return (
      <div className={styles.center}>
        <small>No activity yet</small>
      </div>
    );

  return (
    <ResponsiveContainer height={120}>
      <AreaChart
        data={data}
        margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
      >
        <defs>
          <linearGradient id="count" x1="0" y1="0" x2="0" y2="1">
            <stop offset="15%" stopColor="#002135" stopOpacity={0.8} />
            <stop offset="85%" stopColor="#006586" stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="count"
          stroke="#006586"
          strokeWidth={3}
          fill="url(#count)"
        />
        <XAxis dataKey="date" stroke="white" tick={renderCustomTick} />
        <YAxis stroke="white" allowDecimals={false} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

function PollSubmissionBarChart({ poll }: { poll: PollResult }) {
  const submissionCounts = poll.submissions.reduce((acc, submission) => {
    const optionId = submission.option.optionText;
    if (acc[optionId]) {
      acc[optionId] += 1;
    } else {
      acc[optionId] = 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const totalCount = poll.submissions.length;

  return (
    <div>
      {Object.entries(submissionCounts).map(([optionText, count]) => (
        <div key={optionText} className={styles.optionContainer}>
          <h5>{optionText}</h5>
          <div className={styles.barContainer}>
            <div
              className={styles.innerBar}
              style={{
                width: `${Math.ceil((count / totalCount) * 100)}%`,
              }}
            />
          </div>
          <h4>{count}</h4>
        </div>
      ))}
    </div>
  );
}

function PollSubmissionsTable({
  submissions,
}: {
  submissions: Partial<PollSubmissionResult>[];
}) {
  const { theme } = useTheme();
  const columns = useMemo<ColumnDef<Partial<PollSubmissionResult>>[]>(
    () => [
      {
        header: "Response",
        accessorKey: "option.optionText",
      },
      {
        header: "Name",
        accessorKey: "respondent.name",
      },
      {
        header: "Email",
        accessorKey: "respondent.email",
      },
      {
        header: "Created At",
        accessorKey: "createdAt",
        cell: (info) =>
          getRelativeTimeString(new Date(info.getValue() as string)),
        size: 100,
      },
    ],
    []
  );

  return (
    <Table
      columns={columns}
      initialState={{}}
      data={submissions}
      theme={theme}
    />
  );
}

export function PollMetrics({ poll }: { poll: PollResult }) {
  const submissions = (poll?.submissions ||
    []) as Partial<PollSubmissionResult>[];

  const submissionCountByDate = (poll?.submissionCountByDate ||
    []) as SubmissionsOverTimeResult[];

  return (
    <>
      <div className={styles.container}>
        <div className={styles.basics}>
          <Box width="fit-content">
            <div className={styles.responseCount}>
              <h1>{submissions.length}</h1>
              <h4>Responses</h4>
            </div>
          </Box>
          <div style={{ width: "100%" }}>
            <div className={styles.lineChartHeader}>
              <h3 className={styles.heading}>Activity Over Time</h3>
              <div className={styles.flexBetween}>
                <BsCircleFill color="#006586" />
                <h5>Responses</h5>
              </div>
            </div>
            <Box flexDirection="row">
              <div className={styles.flexChild}>
                <SubmissionsOverTimeLineChart
                  submissionCountByDate={submissionCountByDate}
                />
              </div>
            </Box>
          </div>
        </div>
        <div className={styles.pollSubmissionsContainer}>
          <h3 className={styles.heading}>Responses</h3>
          <Box>
            <PollSubmissionBarChart poll={poll as PollResult} />
          </Box>
        </div>
      </div>
      <PollSubmissionsTable submissions={submissions} />
    </>
  );
}
