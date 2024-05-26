import { EmbedIndex, Layout } from "components";
import nextI18nextConfig from "next-i18next.config";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { ReactNode, useMemo } from "react";
import { SupportedLocale } from "types/global";
import { DashboardTopNav } from "../..";
import { ColumnDef } from "@tanstack/react-table";
import {
  CandidateGuideResult,
  EmbedType,
  useCandidateGuidesByOrganizationQuery,
} from "generated";
import { getRelativeTimeString } from "utils/dates";
import { useAuth } from "hooks/useAuth";
import { useRouter } from "next/router";

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

export default function CandidateGuideEmbedIndex({ slug }: { slug: string }) {
  const router = useRouter();
  const { user } = useAuth({ redirectTo: "/login" });
  const { data, isLoading } = useCandidateGuidesByOrganizationQuery({
    organizationId: user?.organizationId as string,
  });

  const candidateGuideColumns = useMemo<ColumnDef<CandidateGuideResult>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Name",
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
    ],
    []
  );

  const guides = data?.candidateGuidesByOrganization || [];

  return (
    <EmbedIndex
      // @ts-expect-error React table types are difficult to work with
      columns={candidateGuideColumns}
      // @ts-expect-error React table types are difficult to work with
      embeds={guides}
      embedType={EmbedType.CandidateGuide}
      title="Candidate Guides"
      isLoading={isLoading}
      emptyStateMessage="No candidate guides found."
      onRowClick={(row) =>
        router.push(`/dashboard/${slug}/candidate-guides/${row.original.id}`)
      }
    />
    // <Table
    //   // @ts-expect-error React table types are difficult to work with
    //   columns={candidateGuideColumns}
    //   data={guides}
    //   isLoading={isLoading}
    //   emptyStateMessage="No candidate guides found."
    //   onRowClick={(row) =>
    //     router.push(`/dashboard/${slug}/candidate-guides/${row.original.id}`)
    //   }
    //   initialState={{}}
    // />
  );
}

CandidateGuideEmbedIndex.getLayout = (page: ReactNode) => (
  <Layout>
    <DashboardTopNav />
    {page}
  </Layout>
);
