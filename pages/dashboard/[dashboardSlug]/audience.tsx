import { Layout, LoaderFlag } from "components";
import {
  RespondentResult,
  useAudienceQuery,
  useOrganizationBySlugQuery,
} from "generated";
import { useAuth } from "hooks/useAuth";
import nextI18nextConfig from "next-i18next.config";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { ReactNode, useMemo } from "react";
import { SupportedLocale } from "types/global";
import { DashboardTopNav } from ".";
import { ColumnDef } from "@tanstack/react-table";
import { Table } from "components/Table/Table";
import Link from "next/link";

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

function Audience({ dashboardSlug }: { dashboardSlug: string }) {
  const router = useRouter();
  const query = router.query;
  const organizationQuery = useOrganizationBySlugQuery(
    {
      slug: dashboardSlug,
    },
    {
      retry: false,
    }
  );

  const audienceQuery = useAudienceQuery({
    organizationId: organizationQuery.data?.organizationBySlug?.id as string,
  });

  const respondents = useMemo(
    () =>
      audienceQuery.data?.respondentsByOrganizationId?.edges.map(
        (edge) => edge.node
      ) || [],
    [audienceQuery.data]
  );

  const { isLoading, user } = useAuth({
    organizationId: organizationQuery.data?.organizationBySlug?.id,
  });

  const columns = useMemo<ColumnDef<RespondentResult>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Full Name",
        size: 100,
      },
      {
        accessorKey: "email",
        header: "Email",
        size: 100,
      },
    ],
    []
  );

  return organizationQuery.isLoading || isLoading || !user ? (
    <LoaderFlag />
  ) : respondents?.length === 0 ? (
    <div style={{ width: "100%" }}>
      <h3>All Respondents</h3>
      <small>
        No respondents yet.{" "}
        <Link href={`/dashboard/${query.dashboardSlug}/embeds/new`}>
          Try creating a new poll or question embed to begin engaging your
          audience
        </Link>
      </small>
    </div>
  ) : (
    <div style={{ width: "100%" }}>
      <h3>All Respondents</h3>
      <Table
        data={respondents}
        initialState={{
          pagination: {
            pageSize: 10,
          },
        }}
        columns={columns}
      />
    </div>
  );
}

Audience.getLayout = (page: ReactNode) => (
  <Layout>
    <DashboardTopNav />
    {page}
  </Layout>
);

export default Audience;
