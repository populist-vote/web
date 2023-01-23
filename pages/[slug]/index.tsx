import { Layout, LoaderFlag } from "components";
import { useOrganizationBySlugQuery } from "generated";
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
  const navItems = dashboardNavItems(slug);

  const organizationQuery = useOrganizationBySlugQuery(
    {
      slug,
    },
    {
      onError: () => void router.push("/404"),
      onSuccess: (data) => {
        if (!data.organizationBySlug) {
          void router.push("/404");
        }
      },
      retry: false,
    }
  );

  const { isLoading, user } = useAuth({
    organizationId: organizationQuery.data?.organizationBySlug?.id,
  });

  return organizationQuery.isLoading || isLoading || !user ? (
    <LoaderFlag />
  ) : (
    <Layout navItems={navItems}>
      <h1>Dashboard</h1>
      <p>Slug: {slug}</p>
    </Layout>
  );
}

export default Dashboard;
