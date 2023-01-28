import { Layout } from "components";
import { EmbedPage } from "components/EmbedPage/EmbedPage";
import nextI18nextConfig from "next-i18next.config";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { BillFiltersParams } from "pages/bills";
import { SupportedLocale } from "types/global";
import { DashboardTopNav } from "..";

export async function getServerSideProps({
  query,
  locale,
}: {
  query: { slug: string };
  locale: SupportedLocale;
}) {
  return {
    props: {
      query,
      ...(await serverSideTranslations(
        locale,
        ["auth", "common"],
        nextI18nextConfig
      )),
    },
  };
}

function EmbedsNew(props: { query: BillFiltersParams }) {
  return (
    <Layout>
      <DashboardTopNav />
      <h2>New Embed</h2>

      <EmbedPage {...props} />
    </Layout>
  );
}

export default EmbedsNew;
