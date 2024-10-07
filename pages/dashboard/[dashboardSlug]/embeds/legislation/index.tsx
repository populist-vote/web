import { EmbedIndex, Layout } from "components";
import nextI18nextConfig from "next-i18next.config";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { ReactNode, useMemo } from "react";
import { SupportedLocale } from "types/global";
import { DashboardTopNav } from "../..";
import { ColumnDef } from "@tanstack/react-table";
import {
  BillStatus,
  ElectionResult,
  EmbedResult,
  EmbedType,
  IssueTagResult,
  SessionResult,
  useLegislationEmbedsByOrganizationQuery,
  useOrganizationBySlugQuery,
} from "generated";
import { Badge } from "components/Badge/Badge";
import { getRelativeTimeString } from "utils/dates";
import { useAuth } from "hooks/useAuth";
import { BillStatusBadge } from "components/BillStatusBadge/BillStatusBadge";
import styles from "styles/modules/dashboard.module.scss";
import * as Tooltip from "@radix-ui/react-tooltip";

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
        ["auth", "common"],
        nextI18nextConfig
      )),
    },
  };
}

export default function LegislationEmbedsIndex({
  dashboardSlug,
}: {
  dashboardSlug: string;
}) {
  const { data: organizationData } = useOrganizationBySlugQuery(
    {
      slug: dashboardSlug as string,
    },
    {
      enabled: !!dashboardSlug,
    }
  );
  const currentOrganizationId = organizationData?.organizationBySlug?.id;
  useAuth({
    redirectTo: "/login",
    organizationId: currentOrganizationId,
  });
  const { data, isLoading } = useLegislationEmbedsByOrganizationQuery(
    {
      id: currentOrganizationId as string,
    },
    {
      enabled: !!currentOrganizationId,
    }
  );

  const legislationColumns = useMemo<ColumnDef<EmbedResult>[]>(
    () => [
      {
        accessorFn: (row) =>
          !!row.bill ? row.bill?.session : row.ballotMeasure?.election,
        header: "Session",
        cell: (info) => {
          if (info.row.original.bill) {
            const session = info.getValue() as SessionResult;
            const state = session?.state;
            const year = new Date(session?.startDate).getFullYear();
            return `${state ?? "U.S."} - ${year}`;
          }
          if (info.row.original.ballotMeasure) {
            const election = info.row.original.ballotMeasure.election;
            return new Date(election?.electionDate).getFullYear();
          }
        },
        size: 100,
      },
      {
        accessorKey: "bill.billNumber",
        header: "Leg. Code",
        cell: (info) => {
          if (info.row.original.bill) {
            return info.getValue() as string;
          }
          return info.row.original.ballotMeasure?.ballotMeasureCode;
        },
        size: 80,
      },
      {
        accessorKey: "bill.title",
        header: "Title",
        // Render the cell with the title but truncate it when it exceeds two lines
        cell: (info) => (
          <span className={styles.elipsis}>
            {info.row.original.ballotMeasure?.title ??
              info.row.original.bill?.populistTitle ??
              (info.getValue() as string)}
          </span>
        ),
        size: 200,
      },
      {
        accessorKey: "bill.issueTags",
        header: "Issue Tags",
        cell: (info) => {
          const tags = !!info.row.original.ballotMeasure
            ? info.row.original.ballotMeasure.issueTags
            : ((info.getValue() || []) as IssueTagResult[]);
          return (
            <div style={{ display: "flex", gap: "0.5rem" }}>
              {tags.slice(0, 1).map((tag) => (
                <Badge size="small" key={tag.slug}>
                  {tag.name}
                </Badge>
              ))}
              {tags.length > 1 && (
                <Tooltip.Provider delayDuration={300}>
                  <Tooltip.Root>
                    <Tooltip.Trigger className={styles.TooltipTrigger}>
                      <Badge size="small" color="white">
                        <span>
                          +{(info.getValue() as IssueTagResult[]).length - 1}
                        </span>
                      </Badge>
                    </Tooltip.Trigger>
                    <Tooltip.Portal>
                      <Tooltip.Content
                        className={styles.TooltipContent}
                        sideOffset={5}
                      >
                        {tags
                          .slice(1, tags.length)
                          .map((tag) => tag.name)
                          .join(", ")}
                        <Tooltip.Arrow className={styles.TooltipArrow} />
                      </Tooltip.Content>
                    </Tooltip.Portal>
                  </Tooltip.Root>
                </Tooltip.Provider>
              )}
            </div>
          );
        },
      },
      {
        accessorKey: "bill.status",
        header: "Status",
        cell: (info) => (
          <BillStatusBadge
            status={
              (!!info.row.original.ballotMeasure
                ? info.row.original.ballotMeasure.status
                : info.getValue()) as BillStatus
            }
          />
        ),
        size: 180,
      },
      {
        accessorKey: "createdAt",
        header: "Created",
        cell: (info) =>
          new Date(info.getValue() as string).toLocaleDateString(),
        size: 100,
      },
      {
        accessorKey: "updatedAt",
        header: "Last Updated",
        cell: (info) =>
          getRelativeTimeString(new Date(info.getValue() as string)),
        size: 110,
      },
    ],
    []
  );

  const embeds = (data?.embedsByOrganization || []) as EmbedResult[];

  return (
    <EmbedIndex
      isLoading={isLoading}
      slug={dashboardSlug}
      title={"Legislation Embeds"}
      embeds={embeds}
      columns={legislationColumns}
      embedType={EmbedType.Legislation}
    />
  );
}

LegislationEmbedsIndex.getLayout = (page: ReactNode) => (
  <Layout>
    <DashboardTopNav />
    {page}
  </Layout>
);
