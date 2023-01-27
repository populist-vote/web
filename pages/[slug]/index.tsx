import { Button, Layout, LoaderFlag } from "components";
import { DashboardContent } from "components/Dashboard/Dashboard";
import { TopNav } from "components/TopNav/TopNav";
import { useOrganizationBySlugQuery } from "generated";
import { useAuth } from "hooks/useAuth";
import nextI18nextConfig from "next-i18next.config";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { BillFiltersParams } from "pages/bills";
import { SupportedLocale } from "types/global";
import { dashboardNavItems } from "utils/nav";

export async function getServerSideProps({
  query,
  locale,
}: {
  query: { slug: string } & BillFiltersParams;
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

function Dashboard({ slug, query }: { slug: string; query: any }) {
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
      <TopNav>
        <li data-selected={true}>Dashboard</li>
        <div>
          <Button
            variant="primary"
            theme="yellow"
            size="medium"
            onClick={() => void router.push("/")}
            label="New Embed"
          />
        </div>
      </TopNav>
      <DashboardContent query={query} />
    </Layout>
  );
}

export default Dashboard;
