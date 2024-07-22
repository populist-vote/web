import { Box, EmbedIndex, Layout, LoaderFlag, PartyAvatar } from "components";
import nextI18nextConfig from "next-i18next.config";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { ReactNode, useMemo } from "react";
import { SupportedLocale } from "types/global";
import { DashboardTopNav } from "../..";
import { ColumnDef } from "@tanstack/react-table";
import {
  CandidateGuideResult,
  EmbedResult,
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

export async function getServerSideProps({
  query,
  locale,
}: {
  query: { slug: string };
  locale: SupportedLocale;
}) {
  return {
    props: {
      slug: query.slug,
      ...(await serverSideTranslations(
        locale,
        ["auth", "common", "embeds"],
        nextI18nextConfig
      )),
    },
  };
}

export default function CandidateGuideEmbedIndex({ slug }: { slug: string }) {
  const router = useRouter();
  const { data: organizationData } = useOrganizationBySlugQuery(
    {
      slug: slug as string,
    },
    {
      enabled: !!slug,
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
  } = useRecentCandidateGuideQuestionSubmissionsQuery({
    organizationId: currentOrganizationId as string,
    limit: 5,
  });

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
        accessorKey: "embeds",
        header: "Embeds",
        cell: (info) => (info.getValue() as Array<EmbedResult>).length,
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

  if (isLoading || isRecentSubmissionsDataLoading) return <LoaderFlag />;

  return (
    <>
      <EmbedIndex
        // @ts-expect-error React table types are difficult to work with
        columns={candidateGuideColumns}
        // @ts-expect-error React table types are difficult to work with
        embeds={guides}
        slug={slug}
        embedType={EmbedType.CandidateGuide}
        title="Candidate Guides"
        isLoading={false}
        emptyStateMessage="No candidate guides found."
        onRowClick={(row) =>
          router.push(`/dashboard/${slug}/candidate-guides/${row.original.id}`)
        }
      />
      <div>
        <h2>Recent Submissions</h2>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          {recentSubmissionsData?.recentCandidateGuideQuestionSubmissionsByOrganization?.map(
            (submission) => (
              <div style={{ marginBottom: "1rem" }} key={submission.id}>
                <Box>
                  <div
                    style={{
                      display: "flex",
                      gap: "1rem",
                      flexDirection: "row",
                    }}
                  >
                    <div>
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
                      </div>
                    </div>
                    <div>
                      <p
                        style={{
                          color: "var(--blue-text-light)",
                          fontSize: "1.2em",
                        }}
                      >
                        {submission.question.prompt}
                      </p>
                      <p>{submission.response}</p>
                    </div>
                  </div>
                  <div
                    style={{
                      marginTop: "1rem",
                      display: "flex",
                      justifyContent: "flex-end",
                      width: "100%",
                    }}
                  >
                    <small>
                      {getRelativeTimeString(new Date(submission.updatedAt))}
                    </small>
                  </div>
                </Box>
              </div>
            )
          )}
        </div>
      </div>
    </>
  );
}

CandidateGuideEmbedIndex.getLayout = (page: ReactNode) => (
  <Layout>
    <DashboardTopNav />
    {page}
  </Layout>
);
