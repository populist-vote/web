import { Layout } from "components";
import nextI18nextConfig from "next-i18next.config";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

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

function EmbedsIndex() {
  // TODO query for embedsByOrganizationSlug here

  const embeds = [];

  return (
    <Layout>
      <DashboardTopNav />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
        }}
      >
        {embeds.length === 0 && <small>You don't have any embeds yet.</small>}
      </div>
    </Layout>
  );
}

export default EmbedsIndex;
