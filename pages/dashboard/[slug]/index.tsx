import { Button, Layout, LoaderFlag } from "components";
import { Box } from "components/Box/Box";
import { TopNav } from "components/TopNav/TopNav";
import { useOrganizationBySlugQuery } from "generated";
import { useAuth } from "hooks/useAuth";
import nextI18nextConfig from "next-i18next.config";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Link from "next/link";
import { useRouter } from "next/router";
import { BillFiltersParams } from "pages/bills";
import { SupportedLocale } from "types/global";

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

  const { isLoading, user } = useAuth({
    organizationId: organizationQuery.data?.organizationBySlug?.id,
  });

  return organizationQuery.isLoading || isLoading || !user ? (
    <LoaderFlag />
  ) : (
    <Layout>
      <DashboardTopNav />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "1.5rem 0",
        }}
      >
        <Box>
          <h3 style={{ marginTop: 0 }}>
            Welcome to your new dashboard,{" "}
            {organizationQuery.data?.organizationBySlug.name}
          </h3>
          <p style={{ fontSize: "1.1em", marginBottom: 0 }}>
            From here, you'll be able to create and edit your embedded content,
            gain insights from your active embeds, and browse through our
            database of bills, politicians and more.
          </p>
          <p style={{ fontSize: "1.1em", marginBottom: 0 }}>
            If you have any questions, please reach out to us at{" "}
            <a href="mailto:info@populist.us">info@populist.us</a>
          </p>
        </Box>
      </div>
    </Layout>
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
            Dashboard
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
            Embeds
          </Link>
        </li>
        <li
          data-selected={new RegExp(`/dashboard/${slug}/audience`).test(
            router.asPath
          )}
        >
          <Link
            href={{
              pathname: "/dashboard/[slug]/audience",
              query: { slug },
            }}
          >
            Audience
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
          />
        </Link>
      </div>
    </TopNav>
  );
}

export default Dashboard;
