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
import { useState } from "react";
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
  const { support, neutral, oppose } = publicVotes;
  const [voteSelected, setVoteSelected] = useState<ArgumentPosition | null>(
    null
  );
  const queryKey = useBillByIdQuery.getKey({ id });
  const queryClient = useQueryClient();

  const upsertPublicVotesMutation = useUpsertBillPublicVoteMutation({
    // onMutate: async (variables) => {
    //   await queryClient.cancelQueries({ queryKey });
    //   const previousValue = queryClient.getQueryData(queryKey);
    //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
    //   queryClient.setQueryData(queryKey, (oldData: any) => {
    //     const newPublicVotes = {
    //       ...oldData?.publicVotes,
    //       [variables.position.toLowerCase()]:
    //         oldData.billBySlug.publicVotes[variables.position.toLowerCase()] +
    //         1,
    //       [voteSelected as string]:
    //         oldData.billBySlug.publicVotes[voteSelected as string] - 1,
    //     };
    //     return {
    //       ...oldData,
    //       publicVotes: newPublicVotes,
    //       usersVote: variables.position,
    //     };
    //   });
    //   return { previousValue };
    // },
    // onError: (_err, _variables, context) => {
    //   queryClient.setQueryData(queryKey, context?.previousValue);
    // },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey });
    },
  });

  const toggleSupport = () => {
    upsertPublicVotesMutation.mutate({
      billId: id,
      position: ArgumentPosition.Support,
    });
    setVoteSelected(ArgumentPosition.Support);
  };

  const toggleNeutral = () => {
    upsertPublicVotesMutation.mutate({
      billId: id,
      position: ArgumentPosition.Neutral,
    });
    setVoteSelected(ArgumentPosition.Neutral);
  };

  const toggleOppose = () => {
    upsertPublicVotesMutation.mutate({
      billId: id,
      position: ArgumentPosition.Oppose,
    });
    setVoteSelected(ArgumentPosition.Oppose);
  };

  if (isLoading) return <LoaderFlag />;

  return (
    <section className={styles.publicVoting} style={{ width: "100%" }}>
      <h4>What do you think of this legislation?</h4>
      <Badge
        size="small"
        theme="grey"
        lightBackground
        clickable
        selected={voteSelected == ArgumentPosition.Support}
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
        selected={voteSelected == ArgumentPosition.Neutral}
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
        selected={voteSelected == ArgumentPosition.Oppose}
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
