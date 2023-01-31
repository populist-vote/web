import { Button, Layout } from "components";
import { BillSearchAndFilters } from "components/BillFilters/BillSearchAndFilters";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { ReactNode, useMemo } from "react";
import { SupportedLocale } from "types/global";
import { DashboardTopNav } from "..";
import nextI18nextConfig from "next-i18next.config";
import { useRouter } from "next/router";
import {
  BillResult,
  BillStatus,
  IssueTagResult,
  PoliticalScope,
  PopularitySort,
  State,
  useBillIndexQuery,
} from "generated";
import useDebounce from "hooks/useDebounce";
import { Table } from "components/Table/Table";
import { ColumnDef } from "@tanstack/react-table";
import { getStatusInfo } from "utils/bill";
import { Badge } from "components/Badge/Badge";
import { FaCircle } from "react-icons/fa";
import { titleCase } from "utils/strings";
import { getYear } from "utils/dates";

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

function EmbedsLegislation() {
  return (
    <>
      <h1>New Legislation Embed</h1>
      <p>Search and select legislation to embed on your page.</p>
      <BillSearchAndFilters />
      <BillResultsTable />
    </>
  );
}

EmbedsLegislation.getLayout = (page: ReactNode) => (
  <Layout>
    <DashboardTopNav />
    {page}
  </Layout>
);

export default EmbedsLegislation;

function BillResultsTable() {
  const router = useRouter();
  const { query } = router;
  const {
    state = null,
    status = null,
    search = null,
    year = null,
    scope = PoliticalScope.Federal,
    popularity = null,
  } = query;

  const shouldFetchBillResults =
    !!search || !!state || !!status || !!year || !!popularity;

  const debouncedSearchQuery = useDebounce<string | null>(
    search as string,
    350
  );

  const { data } = useBillIndexQuery(
    {
      pageSize: 10,
      filter: {
        query: debouncedSearchQuery || null,
        state: state as State,
        politicalScope: scope as PoliticalScope,
        year: parseInt(year as string),
        status: status as BillStatus,
      },
      sort: {
        popularity: popularity as PopularitySort,
      },
    },
    {
      refetchOnWindowFocus: false,
      enabled: shouldFetchBillResults,
    }
  );

  const billResults = data?.bills.edges.map((edge) => edge.node) as
    | BillResult[]
    | [];

  const columns = useMemo<ColumnDef<BillResult>[]>(
    () => [
      {
        accessorKey: "billNumber",
        header: "Leg. Code",
        size: 100,
      },
      {
        accessorKey: "title",
        header: "Title",
        size: 500,
      },
      {
        accessorKey: "session.startDate",
        header: "Year",
        cell: (info) => getYear(info.getValue() as string),
        size: 100,
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: (info) => {
          const statusInfo = getStatusInfo(info.getValue() as BillStatus);
          return (
            <Badge
              size="small"
              iconLeft={
                <FaCircle size={12} color={`var(--${statusInfo?.color})`} />
              }
              color={statusInfo?.color}
            >
              {titleCase(
                (info.getValue() as string).replaceAll("_", " ") as string
              )}
            </Badge>
          );
        },
      },
      {
        accessorKey: "issueTags",
        header: "Issues",
        cell: (info) =>
          (info.getValue() as IssueTagResult[]).map((tag: IssueTagResult) => (
            <Badge key={tag.id} size="small" color="white">
              {tag.name}
            </Badge>
          )),
      },
      {
        cell: (_info) => (
          <Button variant="primary" size="small" label="Create Embed" />
        ),
        header: "Actions",
      },
    ],
    []
  );

  if (!shouldFetchBillResults) return null;

  return (
    <Table
      data={billResults || []}
      columns={columns}
      initialState={{
        pagination: {
          pageSize: 7,
        },
      }}
    />
  );
}
