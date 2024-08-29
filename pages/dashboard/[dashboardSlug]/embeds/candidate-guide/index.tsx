import { Box, EmbedIndex, Layout, LoaderFlag, PartyAvatar } from "components";
import nextI18nextConfig from "next-i18next.config";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { ReactNode, useMemo } from "react";
import { SupportedLocale } from "types/global";
import { DashboardTopNav } from "../..";
import { ColumnDef } from "@tanstack/react-table";
import {
  CandidateGuideResult,
  EmbedType,
  PoliticalParty,
  useCandidateGuidesByOrganizationQuery,
  useOrganizationBySlugQuery,
  useRecentCandidateGuideQuestionSubmissionsQuery,
} from "generated";
import { getRelativeTimeString, renderSubmissionState } from "utils/dates";
import { useRouter } from "next/router";
import clsx from "clsx";
import styles from "./index.module.scss";
import Link from "next/link";
import { Tooltip } from "components/Tooltip/Tooltip";
import { RiListSettingsFill } from "react-icons/ri";

export async function getServerSideProps({
  query,
  locale,
}: {
  query: { dashboardSlug: string };
  locale: SupportedLocale;
}) {
  return {
    props: {
      dashboardSlug: query.dashboardSlug,
      ...(await serverSideTranslations(
        locale,
        ["auth", "common", "embeds"],
        nextI18nextConfig
      )),
    },
  };
}

export default function CandidateGuideEmbedIndex({
  dashboardSlug,
}: {
  dashboardSlug: string;
}) {
  const router = useRouter();
  const { data: organizationData, isLoading: isOrganizationLoading } =
    useOrganizationBySlugQuery(
      {
        slug: dashboardSlug as string,
      },
      {
        enabled: !!dashboardSlug,
      }
    );
  const currentOrganizationId = organizationData?.organizationBySlug?.id;
  const { data, isLoading } = useCandidateGuidesByOrganizationQuery(
    {
      organizationId: currentOrganizationId as string,
    },
    {
      enabled: !!currentOrganizationId,
    }
  );

  const {
    data: recentSubmissionsData,
    isLoading: isRecentSubmissionsDataLoading,
  } = useRecentCandidateGuideQuestionSubmissionsQuery(
    {
      organizationId: currentOrganizationId as string,
      limit: 10,
    },
    {
      enabled: !!currentOrganizationId,
    }
  );

  const candidateGuideColumns = useMemo<ColumnDef<CandidateGuideResult>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        size: 400,
      },
      {
        accessorKey: "createdAt",
        header: "Created",
        cell: (info) =>
          new Date(info.getValue() as string).toLocaleDateString(),
      },
      {
        accessorKey: "updatedAt",
        header: "Last Updated",
        cell: (info) =>
          getRelativeTimeString(new Date(info.getValue() as string)),
      },
      {
        accessorKey: "embedCount",
        header: "Embeds",
        cell: (info) => info.getValue(),
        size: 5,
      },
      {
        accessorKey: "submissionCount",
        header: "Submissions",
        cell: (info) => info.getValue() as number,
        size: 5,
      },
      {
        accessorKey: "submissionsCloseAt",
        header: "Status",
        cell: (info) => renderSubmissionState(info.getValue() as string),
      },
    ],
    []
  );

  const guides = data?.candidateGuidesByOrganization || [];

  const recentSubs =
    recentSubmissionsData?.recentCandidateGuideQuestionSubmissionsByOrganization ||
    [];

  if (isLoading || isRecentSubmissionsDataLoading || isOrganizationLoading) {
    return <LoaderFlag />;
  }

  return (
    <div className={styles.container}>
      <section>
        <EmbedIndex
          // @ts-expect-error React table types are difficult to work with
          columns={candidateGuideColumns}
          // @ts-expect-error React table types are difficult to work with
          embeds={guides}
          slug={dashboardSlug}
          embedType={EmbedType.CandidateGuide}
          title="Candidate Guides"
          isLoading={false}
          emptyStateMessage="No candidate guides found."
          onRowClick={(row) =>
            router.push(
              `/dashboard/${dashboardSlug}/candidate-guides/${row.original.id}`
            )
          }
        />
      </section>
      <section>
        <h2>Recent Submissions</h2>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          {recentSubs.map((submission) => (
            <div className={styles.submissionBox} key={submission.id}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 7fr",
                  gap: "1rem",
                }}
              >
                <div className={styles.centered}>
                  <Link href={`/politicians/${submission.politician?.slug}`}>
                    <div className={styles.avatarContainer}>
                      <PartyAvatar
                        theme={"dark"}
                        size={80}
                        iconSize="1.25rem"
                        party={submission.politician?.party as PoliticalParty}
                        src={
                          submission.politician?.assets
                            ?.thumbnailImage160 as string
                        }
                        alt={submission.politician?.fullName as string}
                        target={"_blank"}
                        rel={"noopener noreferrer"}
                      />
                      <span className={clsx(styles.link, styles.avatarName)}>
                        {submission.politician?.fullName}
                      </span>
                      <span className={styles.runningFor}>
                        <span style={{ display: "block" }}>Running for </span>
                        <span className={styles.officeInfo}>
                          {submission.politician?.upcomingRace?.office.name} -{" "}
                          {submission.politician?.upcomingRace?.office.subtitle}
                        </span>
                      </span>
                    </div>
                  </Link>
                </div>
                <div>
                  <div className={styles.flexBetween}>
                    <p
                      style={{
                        color: "var(--blue-text-light)",
                        fontSize: "1em",
                      }}
                    >
                      {submission.question.prompt}
                    </p>
                    <small
                      className={styles.flexBetween}
                      style={{ gap: "1rem", color: "var(--blue-text-light)" }}
                    >
                      {getRelativeTimeString(new Date(submission.updatedAt))}
                    </small>
                  </div>
                  <p
                    style={{
                      fontSize: "1.2em",
                    }}
                  >
                    {submission?.response}
                  </p>
                </div>
              </div>
              {submission.candidateGuideEmbed?.id && (
                <div className={styles.flexRight}>
                  <Tooltip content="Manage Embed">
                    <button
                      className={styles.iconButton}
                      onClick={async (e) => {
                        e.stopPropagation();
                        await router.push(
                          `/dashboard/${dashboardSlug}/embeds/candidate-guide/${submission.candidateGuideEmbed?.id}/manage`
                        );
                      }}
                    >
                      <RiListSettingsFill color="var(--blue-text-light)" />
                    </button>
                  </Tooltip>
                </div>
              )}
            </div>
          ))}
          {recentSubs.length === 0 && (
            <Box>
              <small className={styles.noResults}>No submissions</small>
            </Box>
          )}
        </div>
      </section>
    </div>
  );
}

CandidateGuideEmbedIndex.getLayout = (page: ReactNode) => (
  <Layout>
    <DashboardTopNav />
    {page}
  </Layout>
);
