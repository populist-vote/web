import { Layout } from "components";
import { Box } from "components/Box/Box";
import { EmbedForm } from "components/EmbedForm/EmbedForm";
import nextI18nextConfig from "next-i18next.config";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { ReactNode } from "react";
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
      slug: query.slug,
      ...(await serverSideTranslations(
        locale,
        ["auth", "common"],
        nextI18nextConfig
      )),
    },
  };
}

function EmbedsNew({ slug }: { slug: string }) {
  return (
    <>
      <h2>New Embed</h2>
      <Box width="50%">
        <EmbedForm slug={slug} embed={null} />
      </Box>
    </>
  );
}

EmbedsNew.getLayout = (page: ReactNode) => (
  <Layout>
    <DashboardTopNav />
    {page}
  </Layout>
);

export default EmbedsNew;
