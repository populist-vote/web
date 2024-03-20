import { Button, LoaderFlag } from "components";
import { Badge } from "components/Badge/Badge";
import { SponsorsBar } from "components/SponsorsBar/SponsorsBar";
import {
  ArgumentPosition,
  BillResult,
  BillStatus,
  IssueTagResult,
  PoliticianResult,
  useBillByIdQuery,
  useUpsertBillPublicVoteMutation,
} from "generated";
import { getStatusInfo } from "utils/bill";
import { getYear } from "utils/dates";
import { splitAtDigitAndJoin, titleCase } from "utils/strings";
import styles from "./BillWidget.module.scss";
import { LastVoteSection } from "./LastVoteSection/LastVoteSection";
import { useEmbedResizer } from "hooks/useEmbedResizer";
import { WidgetFooter } from "components/WidgetFooter/WidgetFooter";
import { FaCheckCircle } from "react-icons/fa";
import { HiQuestionMarkCircle } from "react-icons/hi";
import { FaCircleXmark } from "react-icons/fa6";
import { useQueryClient } from "@tanstack/react-query";

export interface BillWidgetRenderOptions {
  issueTags: boolean;
  summary: boolean;
  sponsors: boolean;
  publicVoting: boolean;
}

function BillWidget({
  billId,
  embedId,
  origin,
  renderOptions,
}: {
  billId: string;
  embedId: string;
  origin: string;
  renderOptions: BillWidgetRenderOptions;
}) {
  const { data, isLoading, error } = useBillByIdQuery({ id: billId });
  const bill = data?.billById as BillResult;
  const statusInfo = getStatusInfo(bill?.status as BillStatus);

  useEmbedResizer({ origin, embedId });

  const styleVars: React.CSSProperties & {
    [`--status-background`]: string;
    [`--status-border`]: string;
  } = {
    [`--status-background`]: `var(--${statusInfo?.background})`,
    [`--status-border`]: `var(--${statusInfo?.color})`,
  };

  if (isLoading) return <LoaderFlag />;
  if (error) return <div>Something went wrong loading this bill.</div>;

  return (
    <div
      className={styles.billCard}
      style={styleVars}
      data-test-id="populist-bill-widget"
    >
      <header className={styles.header}>
        <strong>
          {bill.state || "U.S."} - {splitAtDigitAndJoin(bill.billNumber)}
        </strong>
        <strong>{getYear(bill.session?.startDate)}</strong>
      </header>
      <main className={styles.cardContent}>
        <section>
          <h2 className={styles.title}>{bill.populistTitle ?? bill.title}</h2>
        </section>
        {renderOptions?.issueTags && !!bill.issueTags.length && (
          <section className={styles.tags}>
            {bill.issueTags?.map((tag: Partial<IssueTagResult>) => (
              <Badge size="small" theme="grey" key={tag.id} lightBackground>
                {tag.name}
              </Badge>
            ))}
          </section>
        )}

        {renderOptions?.summary && (
          <section className={styles.summaryContainer}>
            {bill.populistSummary && (
              <div className={styles.overflowGradient}>
                <div className={styles.description}>
                  <p>{bill.populistSummary}</p>
                </div>
              </div>
            )}
            <a
              href={bill.fullTextUrl as string}
              target="_blank"
              rel="noreferrer"
              style={{ width: "auto" }}
            >
              <Button
                variant="text"
                size="small"
                label="Full Text"
                style={{
                  color: "var(--blue-dark)",
                }}
              />
            </a>
          </section>
        )}

        <section className={styles.statusAndVotesContainer}>
          <div className={styles.statusContainer}>
            <h4>Status</h4>
            <div className={styles.status}>
              <div>
                {titleCase(bill.status?.replaceAll("_", " ") as string)}
              </div>
            </div>
          </div>
          <LastVoteSection votes={bill.legiscanData?.votes || []} />
        </section>
        {renderOptions?.sponsors && bill.sponsors?.length > 0 && (
          <section className={styles.sponsors}>
            <h4>Sponsors</h4>
            <SponsorsBar endorsements={bill.sponsors as PoliticianResult[]} />
          </section>
        )}
        {renderOptions?.publicVoting && <PublicVoting id={bill.id} />}
      </main>
      <WidgetFooter learnMoreHref={`/bills/${bill.slug}`} />
    </div>
  );
}

function PublicVoting({ id }: { id: string }) {
  const { data, isLoading } = useBillByIdQuery({ id });
  const bill = data?.billById as BillResult;
  const { publicVotes } = bill;
  const usersVote = bill.usersVote as string;
  const { support, neutral, oppose } = publicVotes;
  const queryKey = useBillByIdQuery.getKey({ id });
  const queryClient = useQueryClient();

  const upsertPublicVotesMutation = useUpsertBillPublicVoteMutation({
    onMutate: async (_variables) => {
      await queryClient.cancelQueries({ queryKey });
      const previousValue = queryClient.getQueryData(queryKey);
      return { previousValue };
    },
    onError: (_err, _variables, context) => {
      queryClient.setQueryData(queryKey, context?.previousValue);
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey });
    },
  });

  const toggleSupport = () => {
    const newPosition =
      usersVote === ArgumentPosition.Support ? null : ArgumentPosition.Support;
    upsertPublicVotesMutation.mutate({
      billId: id,
      position: newPosition,
    });
  };

  const toggleNeutral = () => {
    const newPosition =
      usersVote === ArgumentPosition.Neutral ? null : ArgumentPosition.Neutral;
    upsertPublicVotesMutation.mutate({
      billId: id,
      position: newPosition,
    });
  };

  const toggleOppose = () => {
    const newPosition =
      usersVote === ArgumentPosition.Oppose ? null : ArgumentPosition.Oppose;
    upsertPublicVotesMutation.mutate({
      billId: id,
      position: newPosition,
    });
  };

  if (isLoading) return <LoaderFlag />;

  return (
    <section className={styles.publicVoting} style={{ width: "100%" }}>
      <h5 style={{ fontSize: "1em", marginBottom: "0.5rem" }}>
        What do you think of this legislation?
      </h5>
      <Badge
        size="small"
        theme="grey"
        lightBackground
        clickable
        selected={usersVote == ArgumentPosition.Support}
        onClick={toggleSupport}
      >
        <FaCheckCircle color="var(--green-support)" size={20} /> Support
        {!!support && support > 0 && (
          <span className={styles.pill}>{support}</span>
        )}
      </Badge>
      <Badge
        size="small"
        theme="grey"
        lightBackground
        clickable
        selected={usersVote == ArgumentPosition.Neutral}
        onClick={toggleNeutral}
      >
        <HiQuestionMarkCircle color="var(--orange-light)" size={25} />
        Undecided
        {!!neutral && neutral > 0 && (
          <span className={styles.pill}>{neutral}</span>
        )}
      </Badge>
      <Badge
        size="small"
        theme="grey"
        lightBackground
        clickable
        selected={usersVote == ArgumentPosition.Oppose}
        onClick={toggleOppose}
      >
        <FaCircleXmark color="var(--red)" size={20} />
        Oppose
        {!!oppose && oppose > 0 && (
          <span className={styles.pill}>{oppose}</span>
        )}
      </Badge>
    </section>
  );
}

export { BillWidget };
