import { Button, Layout } from "components";
import { TopNav } from "components/TopNav/TopNav";
import { useOrganizationBySlugQuery } from "generated";
import { useAuth } from "hooks/useAuth";
import nextI18nextConfig from "next-i18next.config";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Link from "next/link";
import { useRouter } from "next/router";
import { BillFiltersParams } from "pages/bills";
import { SupportedLocale } from "types/global";
import { MdSpaceDashboard } from "react-icons/md";
import { BiCodeBlock } from "react-icons/bi";
import { ReactNode } from "react";
import { useTheme } from "hooks/useTheme";
import { LAST_SELECTED_EMBED_TYPE } from "utils/constants";
import { BsPeopleFill } from "react-icons/bs";
import { Dashboard } from "components/Dashboard/Dashboard";

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

function DashboardIndex({ slug }: { slug: string }) {
  const organizationQuery = useOrganizationBySlugQuery(
    {
      slug,
    },
    {
      retry: false,
    }
  );

  const organizationId = organizationQuery.data?.organizationBySlug
    ?.id as string;

  const { isLoading } = useAuth({ organizationId });
  return organizationQuery.isLoading || isLoading ? null : (
    <Dashboard organizationId={organizationId} />
  );
}

export function DashboardTopNav() {
  const router = useRouter();
  const { theme } = useTheme();
  const { slug } = router.query;
  return (
    <TopNav>
      <ul>
        <li
          data-selected={router.asPath == `/dashboard/${slug}`}
          data-color={theme}
        >
          <Link
            href={{
              pathname: "/dashboard/[slug]",
              query: { slug },
            }}
          >
            <MdSpaceDashboard /> Dashboard
          </Link>
        </li>
        <li
          data-selected={new RegExp(`/dashboard/${slug}/embeds`).test(
            router.asPath
          )}
          data-color={theme}
        >
          <Link
            href={{
              pathname: `/dashboard/[slug]/embeds/${
                localStorage.getItem(LAST_SELECTED_EMBED_TYPE) || "legislation"
              }`,
              query: { slug },
            }}
          >
            <BiCodeBlock /> Embeds
          </Link>
        </li>
        <li
          data-selected={router.asPath == `/dashboard/${slug}/audience`}
          data-color={theme}
        >
          <Link
            href={{
              pathname: "/dashboard/[slug]/audience",
              query: { slug },
            }}
          >
            <BsPeopleFill /> Audience
          </Link>
        </li>
      </ul>
      <div>
        <Link
          href={{
            pathname: `/dashboard/[slug]/embeds/new`,
            query: { slug: router.query.slug },
          }}
        >
          <Button
            variant="primary"
            size="medium"
            theme={theme}
            label="New Embed"
            wrapText={false}
          />
        </Link>
      </div>
    </TopNav>
  );
}

DashboardIndex.getLayout = (page: ReactNode) => (
  <Layout>
    <DashboardTopNav />
    {page}
  </Layout>
);
export default DashboardIndex;
