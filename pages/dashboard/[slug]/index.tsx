import { Button, Layout, LoaderFlag } from "components";
import { Box } from "components/Box/Box";
import { TopNav } from "components/TopNav/TopNav";
import { OrganizationResult, useOrganizationBySlugQuery } from "generated";
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

function DashboardContent({
  organization,
}: {
  organization?: OrganizationResult;
}) {
  return (
    <Box>
      <h3 style={{ marginTop: 0 }}>
        Welcome to your new dashboard, {organization?.name}
      </h3>
      <p style={{ fontSize: "1.1em", marginBottom: 0 }}>
        From here, you'll be able to create and edit your embedded content, gain
        insights from your active embeds, and browse through our database of
        bills, politicians and more.
      </p>
      <p style={{ fontSize: "1.1em", marginBottom: 0 }}>
        If you have any questions, please reach out to us at{" "}
        <a href="mailto:info@populist.us">info@populist.us</a>
      </p>
    </Box>
  );
}

function Dashboard({ slug }: { slug: string }) {
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

  const { isLoading } = useAuth({
    organizationId: organizationQuery.data?.organizationBySlug?.id,
  });

  return organizationQuery.isLoading || isLoading ? (
    <LoaderFlag />
  ) : (
    <DashboardContent
      organization={
        organizationQuery.data?.organizationBySlug as OrganizationResult
      }
    />
  );
}

export function DashboardTopNav() {
  const router = useRouter();
  const { slug } = router.query;
  return (
    <TopNav>
      <ul>
        <li data-selected={router.asPath == `/dashboard/${slug}`}>
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
        >
          <Link
            href={{
              pathname: "/dashboard/[slug]/embeds",
              query: { slug },
            }}
          >
            <BiCodeBlock /> Embeds
          </Link>
        </li>
      </ul>
      <div>
        <Link
          href={{
            pathname: "/dashboard/[slug]/embeds/new",
            query: { slug },
          }}
        >
          <Button
            variant="primary"
            size="medium"
            theme="yellow"
            label="New Embed"
            wrapText={false}
          />
        </Link>
      </div>
    </TopNav>
  );
}

Dashboard.getLayout = (page: ReactNode) => (
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
export default Dashboard;
