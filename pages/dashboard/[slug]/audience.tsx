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

function Audience({ slug }: { slug: string }) {
  const router = useRouter();
  const query = router.query;
  const organizationQuery = useOrganizationBySlugQuery(
    {
      slug,
    },
    {
      retry: false,
    }
  );

  const audienceQuery = useAudienceQuery({
    organizationId: organizationQuery.data?.organizationBySlug?.id as string,
  });

  const respondents =
    audienceQuery.data?.respondentsByOrganizationId?.edges.map(
      (edge) => edge.node
    ) || [];

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
  ) : respondents.length === 0 ? (
    <div>
      <h3 style={{ marginTop: 0 }}>All Respondents</h3>
      <small>
        No respondents yet.{" "}
        <Link href={`/dashboard/${query.slug}/embeds/new`}>
          Try creating a new poll or question embed to begin engaging your
          audience
        </Link>
      </small>
    </div>
  ) : (
    <div>
      <h3 style={{ marginTop: 0 }}>All Respondents</h3>
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
    <div
      style={{
        display: "flex",
        padding: "1.5rem 0",
      }}
    >
      {page}
    </div>
  </Layout>
);

export default Audience;
