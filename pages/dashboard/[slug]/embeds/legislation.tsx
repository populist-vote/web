import { Layout } from "components";
import { BillSearchAndFilters } from "components/BillFilters/BillSearchAndFilters";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { ReactNode } from "react";
import { SupportedLocale } from "types/global";
import { DashboardTopNav } from "..";
import nextI18nextConfig from "next-i18next.config";
import { BillResults } from "components/BillResults/BillResults";

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
      <BillResults />
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
