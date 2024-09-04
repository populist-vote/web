import { EmbedIndex, Layout } from "components";
import { EmbedType } from "generated";
import nextI18nextConfig from "next-i18next.config";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { SupportedLocale } from "types/global";
import styles from "./index.module.scss";
import { useRouter } from "next/router";
import { ReactNode } from "react";
import { DashboardTopNav } from "../..";

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
  return (
    <div className={styles.container}>
      <section>
        <EmbedIndex
          columns={[]}
          embeds={[]}
          slug={dashboardSlug}
          embedType={EmbedType.MyBallot}
          title="My Ballot"
          isLoading={false}
          onRowClick={(row) =>
            router.push(`/dashboard/${dashboardSlug}/embeds/${row.original.id}`)
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
