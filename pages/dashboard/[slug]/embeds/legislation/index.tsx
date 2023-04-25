import { EmbedIndex, Layout, LoaderFlag } from "components";
import nextI18nextConfig from "next-i18next.config";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { ReactNode, useMemo } from "react";
import { SupportedLocale } from "types/global";
import { DashboardTopNav } from "../..";
import { ColumnDef } from "@tanstack/react-table";
import {
  BillStatus,
  EmbedResult,
  IssueTagResult,
  SessionResult,
  useEmbedsByOrganizationQuery,
} from "generated";
import { Badge } from "components/Badge/Badge";
import { getRelativeTimeString } from "utils/dates";
import { useAuth } from "hooks/useAuth";
import { toast } from "react-toastify";
import { BillStatusBadge } from "components/BillStatusBadge/BillStatusBadge";
import styles from "styles/modules/dashboard.module.scss";

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
  const { user } = useAuth();
  const { data, isLoading } = useEmbedsByOrganizationQuery(
    {
      id: user?.organizationId as string,
    },
    {
      onError: (error) => {
        toast((error as Error).message, { type: "error" });
      },
    }
  );
  const legislationColumns = useMemo<ColumnDef<EmbedResult>[]>(
    () => [
      {
        accessorKey: "bill.session",
        header: "Session",
        cell: (info) => {
          const session = info.getValue() as SessionResult;
          const state = session.state;
          const year = new Date(session.startDate).getFullYear();
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
          <span className={styles.elipsis}>{info.getValue() as string}</span>
        ),
        size: 200,
      },
      {
        accessorKey: "bill.issueTags",
        header: "Issue Tags",
        cell: (info) => {
          const tags = info.getValue() as IssueTagResult[];
          return (
            <div style={{ display: "flex", gap: "0.5rem" }}>
              {tags.map((tag) => (
                <Badge size="small" key={tag.slug}>
                  {tag.name}
                </Badge>
              ))}
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

  if (isLoading) return <LoaderFlag />;

  const embeds = data?.embedsByOrganization as EmbedResult[];
  const legislationEmbeds = embeds.filter(
    (embed) => embed.attributes.embedType === "legislation"
  );

  return (
    <EmbedIndex
      slug={slug}
      title={"Legislation Embeds"}
      embeds={legislationEmbeds}
      columns={legislationColumns}
      embedType="legislation"
    />
  );
}

LegislationEmbedsIndex.getLayout = (page: ReactNode) => (
  <Layout>
    <DashboardTopNav />
    {page}
  </Layout>
);
