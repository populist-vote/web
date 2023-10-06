import { Button, Layout, LoaderFlag } from "components";
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
// import { BsPeopleFill } from "react-icons/bs";

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
  const router = useRouter();

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

  const organizationId = organizationQuery.data?.organizationBySlug
    ?.id as string;

  const { isLoading } = useAuth({ organizationId });

  return organizationQuery.isLoading || isLoading ? (
    <LoaderFlag />
  ) : (
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
            pathname: router.pathname.includes("legislation")
              ? `/dashboard/[slug]/embeds/legislation/new`
              : router.pathname.includes("politician")
              ? `/dashboard/[slug]/embeds/politician/new`
              : router.pathname.includes("question")
              ? `/dashboard/[slug]/embeds/question/new`
              : router.pathname.includes("race")
              ? `/dashboard/[slug]/embeds/race/new`
              : router.pathname.includes("poll")
              ? `/dashboard/[slug]/embeds/poll/new`
              : `/dashboard/[slug]/embeds/new`,
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
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        padding: "1.5rem 0",
      }}
    >
      {page}
    </div>
  </Layout>
);
export default DashboardIndex;
