import {
  Box,
  Button,
  Layout,
  LoaderFlag,
  RadioGroup,
  SearchInput,
} from "components";
import {
  StatementModerationStatus,
  useConversationByIdQuery,
  useModerateStatementMutation,
} from "generated";
import { GetServerSideProps } from "next";
import nextI18nextConfig from "next-i18next.config";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { ReactNode, useState, useEffect } from "react";
import { SupportedLocale } from "types/global";
import { DashboardTopNav } from "../..";
import { EmbedHeader } from "components/EmbedHeader/EmbedHeader";
import { ConversationViewSwitcher } from "./manage";
import styles from "./manage.module.scss";
import { FaCheckCircle, FaMinusCircle } from "react-icons/fa";
import { AiFillCloseCircle } from "react-icons/ai";
import { PageIndex } from "components/PageIndex/PageIndex";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

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

export default function ConversationModeratePage() {
  const router = useRouter();
  const { id, dashboardSlug } = router.query;
  const queryClient = useQueryClient();

  // State
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState<
    "unmoderated" | "accepted" | "rejected" | "seed"
  >("unmoderated");
  const [paginationPage, setPaginationPage] = useState<number>(0); // Start from 0
  const ITEMS_PER_PAGE = 5;

  // Query
  const queryKey = ["ConversationById", { id }];
  const { data, isLoading, refetch } = useConversationByIdQuery({
    id: id as string,
  });

  // Mutation
  const { mutateAsync: moderateStatement } = useModerateStatementMutation();

  // Reset pagination when search or filter changes
  useEffect(() => {
    setPaginationPage(0);
  }, [searchValue, currentPage]);

  const moderationCounts = {
    unmoderated:
      data?.conversationById?.statements.filter(
        (s) => s.moderationStatus === StatementModerationStatus.Unmoderated
      ).length || 0,
    accepted:
      data?.conversationById?.statements.filter(
        (s) => s.moderationStatus === StatementModerationStatus.Accepted
      ).length || 0,
    rejected:
      data?.conversationById?.statements.filter(
        (s) => s.moderationStatus === StatementModerationStatus.Rejected
      ).length || 0,
    seed:
      data?.conversationById?.statements.filter(
        (s) => s.moderationStatus === StatementModerationStatus.Seed
      ).length || 0,
  };

  // Filter statements
  const filteredStatements =
    data?.conversationById?.statements.filter(
      (statement) =>
        // First filter by moderation status
        statement.moderationStatus === currentPage.toUpperCase() &&
        // Then filter by search term
        statement.content.toLowerCase().includes(searchValue.toLowerCase())
    ) || [];

  // Paginate statements
  const startIndex = paginationPage * ITEMS_PER_PAGE;
  const paginatedStatements = filteredStatements.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  // Handlers
  const handleModeration = async (
    statementId: string,
    status: StatementModerationStatus
  ) => {
    try {
      await moderateStatement({
        statementId,
        moderationStatus: status,
      });

      // Invalidate and refetch in sequence
      await queryClient.invalidateQueries({ queryKey });
      await refetch();

      // If we're on the last item of the page and the page isn't 0,
      // go back one page
      if (paginatedStatements.length === 1 && paginationPage > 0) {
        setPaginationPage((prev) => prev - 1);
      }
    } catch (error) {
      toast.error(`Moderation failed: ${(error as Error).message}`);
    }
  };

  const handleAccept = (statementId: string) =>
    handleModeration(statementId, StatementModerationStatus.Accepted);

  const handleReject = (statementId: string) =>
    handleModeration(statementId, StatementModerationStatus.Rejected);

  const handleFilterChange = (
    value: "unmoderated" | "accepted" | "rejected" | "seed"
  ) => {
    setCurrentPage(value);
    setPaginationPage(0);
  };

  if (!data?.conversationById) return null;
  if (isLoading) return <LoaderFlag />;

  return (
    <div>
      <DashboardTopNav />
      <EmbedHeader
        title={data.conversationById.topic}
        embedType="conversations"
        backLink={`/dashboard/${dashboardSlug}/conversations`}
      />
      <ConversationViewSwitcher
        currentView="moderate"
        conversationId={id as string}
      />
      <h2>Statements</h2>
      <RadioGroup
        selected={currentPage}
        options={[
          {
            value: "unmoderated",
            label: (
              <>
                Unmoderated{" "}
                <span className={styles.count}>
                  {moderationCounts.unmoderated}
                </span>
              </>
            ),
          },
          {
            value: "accepted",
            label: (
              <>
                Accepted{" "}
                <span className={styles.count}>
                  {moderationCounts.accepted}
                </span>
              </>
            ),
          },
          {
            value: "rejected",
            label: (
              <>
                Rejected{" "}
                <span className={styles.count}>
                  {moderationCounts.rejected}
                </span>
              </>
            ),
          },
          {
            value: "seed",
            label: (
              <>
                Seed{" "}
                <span className={styles.count}>{moderationCounts.seed}</span>
              </>
            ),
          },
        ]}
        onChange={handleFilterChange}
      />
      <section style={{ marginTop: "2rem" }}>
        <Box>
          <SearchInput
            searchId="statements"
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            placeholder="Search statements"
          />
        </Box>
        {paginatedStatements.length === 0 && (
          <div className={styles.centered} style={{ marginTop: "2rem" }}>
            <span className={styles.noResults}>
              No {currentPage.toUpperCase()} statements
            </span>
          </div>
        )}
        {paginatedStatements.length > 0 && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              marginTop: "2rem",
            }}
          >
            <PageIndex
              data={filteredStatements}
              onPageChange={setPaginationPage}
              currentPage={paginationPage}
              pageSize={ITEMS_PER_PAGE}
            />
            {paginatedStatements.map((statement) => (
              <div key={statement.id}>
                <Box>
                  <p style={{ textAlign: "center", fontSize: "1.5em" }}>
                    {statement.content}
                  </p>
                  <div className={styles.flexBetween}>
                    <div className={styles.flexLeft}>
                      <div className={styles.voteBadge}>
                        <FaCheckCircle size={21} color="var(--green-support)" />
                        {statement.agreeCount}
                      </div>
                      <div className={styles.voteBadge}>
                        <AiFillCloseCircle size={21} color="var(--red)" />
                        {statement.disagreeCount}
                      </div>
                      <div className={styles.voteBadge}>
                        <FaMinusCircle size={21} color="var(--grey)" />
                        {statement.passCount}
                      </div>
                    </div>
                    {statement.moderationStatus !=
                      StatementModerationStatus.Seed && (
                      <div className={styles.flexRight}>
                        <Button
                          label="Accept"
                          size="medium"
                          onClick={() => handleAccept(statement.id)}
                          disabled={
                            statement.moderationStatus ===
                            StatementModerationStatus.Accepted
                          }
                        />
                        <Button
                          size="medium"
                          variant="primary"
                          label="Reject"
                          onClick={() => handleReject(statement.id)}
                          disabled={
                            statement.moderationStatus ===
                            StatementModerationStatus.Rejected
                          }
                        />
                      </div>
                    )}
                  </div>
                </Box>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

ConversationModeratePage.getLayout = (page: ReactNode) => (
  <Layout>{page}</Layout>
);
