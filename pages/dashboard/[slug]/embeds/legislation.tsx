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
  useUpsertEmbedMutation,
} from "generated";
import useDebounce from "hooks/useDebounce";
import { Table } from "components/Table/Table";
import { ColumnDef, Row } from "@tanstack/react-table";
import { getStatusInfo } from "utils/bill";
import { Badge } from "components/Badge/Badge";
import { FaCircle } from "react-icons/fa";
import { titleCase } from "utils/strings";
import { getYear } from "utils/dates";
import { useAuth } from "hooks/useAuth";
import { toast } from "react-toastify";

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
  const router = useRouter();
  const { query } = router;
  const { slug, selected, embedId } = query;
  const { user } = useAuth({ redirect: false });
  const upsertEmbed = useUpsertEmbedMutation();

  const isEmbedCreated = !!embedId;

  const handleCreateEmbed = () => {
    upsertEmbed.mutate(
      {
        input: {
          id: embedId as string,
          name: "Legislation Embed",
          populistUrl: "https://populist.us",
          organizationId: user?.organizationId as string,
          attributes: {
            billId: selected as string,
          },
        },
      },
      {
        onSuccess: (data) => {
          toast("Embed saved!", { type: "success", position: "bottom-right" });
          void router.push(
            `/dashboard/${slug}/embeds/${data.upsertEmbed.id}`,
            undefined,
            {
              shallow: true,
            }
          );
        },
      }
    );
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1>{isEmbedCreated ? "Edit" : "New"} Legislation Embed</h1>
        <Button
          size="large"
          variant="secondary"
          label={isEmbedCreated ? "Save Embed" : "Create Embed"}
          disabled={!selected && !isEmbedCreated}
          onClick={handleCreateEmbed}
        />
      </div>
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
    scope = null,
    issue = null,
    popularity = null,
    selected = null,
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
        issueTag: issue as string,
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
        size: 80,
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
        size: 60,
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
              theme={statusInfo?.color}
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
    ],
    []
  );

  const onRowClick = (row: Row<BillResult>) => {
    void router.replace(
      {
        query: { ...query, selected: row.original.id },
      },
      undefined,
      {
        scroll: false,
        shallow: true,
      }
    );
  };

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
      onRowClick={onRowClick}
      selectedRowId={selected as string}
    />
  );
}
