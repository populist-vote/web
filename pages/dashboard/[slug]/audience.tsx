import { Layout, LoaderFlag } from "components";
import { Box } from "components/Box/Box";
import { useOrganizationBySlugQuery } from "generated";
import { useAuth } from "hooks/useAuth";
import nextI18nextConfig from "next-i18next.config";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { ReactNode } from "react";
import { SupportedLocale } from "types/global";
import { DashboardTopNav } from ".";

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

function Audience({ slug }: { slug: string }) {
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
    <Box>
      <h3 style={{ marginTop: 0 }}>
        Audience engagement metrics for{" "}
        {organizationQuery.data?.organizationBySlug.name}
      </h3>
      <p style={{ fontSize: "1.1em", marginBottom: 0 }}>
        - Table with searchable list of audience members (for embedded polls and
        questions)
      </p>
      <p style={{ fontSize: "1.1em", marginBottom: 0 }}>
        - Graphs about engagement metrics
      </p>
    </Box>
  );
}

Audience.getLayout = (page: ReactNode) => (
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

export default Audience;
