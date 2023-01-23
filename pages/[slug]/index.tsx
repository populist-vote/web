import { Layout } from "components";
import { useOrganizationIdBySlugQuery } from "generated";
import { useAuth } from "hooks/useAuth";
import nextI18nextConfig from "next-i18next.config";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { SupportedLocale } from "types/global";
import { dashboardNavItems } from "utils/nav";

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

function Dashboard({ slug }: { slug: string }) {
  const router = useRouter();
  const navItems = dashboardNavItems(router);

  const orgIdQuery = useOrganizationIdBySlugQuery({
    slug,
  });

  const { isLoading, user } = useAuth({
    organizationId: orgIdQuery.data?.organizationBySlug?.id,
  });

  return isLoading || !user ? (
    <div />
  ) : (
    <Layout navItems={navItems}>
      <h1>Dashboard</h1>
      <p>Slug: {slug}</p>
    </Layout>
  );
}

export default Dashboard;
