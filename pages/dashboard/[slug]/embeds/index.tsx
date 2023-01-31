import { Layout, LoaderFlag } from "components";
import { Box } from "components/Box/Box";
import { useEmbedsByOrganizationQuery } from "generated";
import { useAuth } from "hooks/useAuth";
import nextI18nextConfig from "next-i18next.config";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Link from "next/link";
import { ReactNode } from "react";
import { toast } from "react-toastify";

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

function EmbedsIndex({ slug }: { slug: string }) {
  const { user } = useAuth({ redirect: false });
  const { data, isLoading } = useEmbedsByOrganizationQuery(
    {
      id: user.organizationId as string,
    },
    {
      onError: (error) => {
        toast((error as Error).message, { type: "error" });
      },
    }
  );

  const embeds = data?.embedsByOrganization;

  if (isLoading) return <LoaderFlag />;

  return embeds?.length === 0 ? (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "50vh",
      }}
    >
      <small>You don't have any embeds yet.</small>
    </div>
  ) : (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "1rem",
        marginTop: "1rem",
      }}
    >
      {embeds?.map((embed) => (
        <Link key={embed.id} href={`/dashboard/${slug}/embeds/${embed.id}`}>
          <Box isLink>
            <h3 style={{ margin: 0, color: "white" }}>{embed.name}</h3>
            <p style={{ color: "white", fontSize: "16px" }}>
              {embed.description}
            </p>
            <div>
              <Link href={embed.populistUrl}>Visit URL</Link>
            </div>
          </Box>
        </Link>
      ))}
    </div>
  );
}

EmbedsIndex.getLayout = (page: ReactNode) => (
  <Layout>
    <DashboardTopNav />
    {page}
  </Layout>
);

export default EmbedsIndex;
