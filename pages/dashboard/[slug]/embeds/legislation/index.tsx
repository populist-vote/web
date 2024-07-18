import { EmbedIndex, Layout } from "components";
import nextI18nextConfig from "next-i18next.config";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { ReactNode, useMemo } from "react";
import { SupportedLocale } from "types/global";
import { DashboardTopNav } from "../..";
import { ColumnDef } from "@tanstack/react-table";
import {
  BillStatus,
  EmbedResult,
  EmbedType,
  IssueTagResult,
  SessionResult,
  useEmbedsByOrganizationQuery,
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
  query: { slug: string };
  locale: SupportedLocale;
}) {
  return {
    props: {
      slug: query.slug,
      ...(await serverSideTranslations(
        locale,
        ["auth", "common"],
        nextI18nextConfig
      )),
    },
  };
}

export default function LegislationEmbedsIndex({ slug }: { slug: string }) {
  const { data: organizationData } = useOrganizationBySlugQuery({
    slug,
  });
  const currentOrganizationId = organizationData?.organizationBySlug?.id;
  useAuth({
    redirectTo: "/login",
    organizationId: currentOrganizationId,
  });
  const { data, isLoading } = useEmbedsByOrganizationQuery({
    id: currentOrganizationId as string,
    filter: {
      embedType: EmbedType.Legislation,
    },
  });
  const legislationColumns = useMemo<ColumnDef<EmbedResult>[]>(
    () => [
      {
        accessorKey: "bill.session",
        header: "Session",
        cell: (info) => {
          const session = info.getValue() as SessionResult;
          const state = session?.state;
          const year = new Date(session?.startDate).getFullYear();
          return `${state} - ${year}`;
        },
        size: 100,
      },
      {
        accessorKey: "bill.billNumber",
        header: "Leg. Code",
        size: 100,
      },
      {
        accessorKey: "bill.title",
        header: "Title",
        // Render the cell with the title but truncate it when it exceeds two lines
        cell: (info) => (
          <span className={styles.elipsis}>
            {info.row.original.bill?.populistTitle ??
              (info.getValue() as string)}
          </span>
        ),
        size: 200,
      },
      {
        accessorKey: "bill.issueTags",
        header: "Issue Tags",
        cell: (info) => {
          const tags = (info.getValue() || []) as IssueTagResult[];
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
          <BillStatusBadge status={info.getValue() as BillStatus} />
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
      slug={slug}
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
