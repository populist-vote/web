import { EmbedIndex, Layout } from "components";
import { EmbedType, useMyBallotEmbedsByOrganizationQuery } from "generated";
import nextI18nextConfig from "next-i18next.config";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { SupportedLocale } from "types/global";
import styles from "./index.module.scss";
import { useRouter } from "next/router";
import { ReactNode, useMemo } from "react";
import { DashboardTopNav } from "../..";
import useOrganizationStore from "hooks/useOrganizationStore";

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

export default function MyBallotEmbedIndex({
  dashboardSlug,
}: {
  dashboardSlug: string;
}) {
  const router = useRouter();
  const myBallotColumns = useMemo(
    () => [
      {
        accessorKey: "election.title",
        header: "Election",
      },
    ],
    []
  );
  const { organizationId } = useOrganizationStore();
  const { data } = useMyBallotEmbedsByOrganizationQuery({
    id: organizationId as string,
  });

  return (
    <div className={styles.container}>
      <section>
        <EmbedIndex
          columns={myBallotColumns}
          // @ts-expect-error  - react table types
          embeds={data?.embedsByOrganization || []}
          slug={dashboardSlug}
          embedType={EmbedType.MyBallot}
          title="My Ballot"
          isLoading={false}
          onRowClick={(row) =>
            router.push(
              `/dashboard/${dashboardSlug}/embeds/my-ballot/${row.original.id}/manage`
            )
          }
        />
      </section>
    </div>
  );
}

MyBallotEmbedIndex.getLayout = (page: ReactNode) => (
  <Layout>
    <DashboardTopNav />
    {page}
  </Layout>
);