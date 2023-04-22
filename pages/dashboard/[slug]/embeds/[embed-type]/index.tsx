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
  IssueTagResult,
  SessionResult,
} from "generated";
import { Badge } from "components/Badge/Badge";
import { titleCase } from "utils/strings";
import { getRelativeTimeString } from "utils/dates";

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
  const columns = useMemo<ColumnDef<EmbedResult>[]>(
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
        size: 80,
      },
      {
        accessorKey: "bill.title",
        header: "Title",
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
        cell: (info) => {
          const status = info.getValue() as string;
          return (
            <Badge
              size="small"
              theme={
                status === BillStatus.BecameLaw
                  ? "green-support"
                  : status === BillStatus.Failed
                  ? "red"
                  : status === BillStatus.InConsideration
                  ? "orange"
                  : status === BillStatus.Introduced
                  ? "violet"
                  : "yellow"
              }
            >
              {titleCase(status.split("_").join(" "))}
            </Badge>
          );
        },
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
        size: 100,
      },
    ],
    []
  );
  return (
    <EmbedIndex
      slug={slug}
      title="Legislation Embeds"
      columns={columns}
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
