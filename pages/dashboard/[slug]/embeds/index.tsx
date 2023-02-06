import { BillCard, Button, Layout, LoaderFlag } from "components";
import { Box } from "components/Box/Box";
import { useEmbedsByOrganizationQuery } from "generated";
import { useAuth } from "hooks/useAuth";
import nextI18nextConfig from "next-i18next.config";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Link from "next/link";
import { ReactNode } from "react";
import { toast } from "react-toastify";
import { getRelativeTimeString } from "utils/dates";

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
  const { user } = useAuth();
  const { data, isLoading } = useEmbedsByOrganizationQuery(
    {
      id: user?.organizationId as string,
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
        // gridTemplateColumns: "repeat(3, 1fr)",
        gap: "1rem",
        marginTop: "1.5rem",
      }}
    >
      {embeds?.map((embed) => (
        // <Link key={embed.id} href={`/dashboard/${slug}/embeds/${embed.id}`}>
        <Box key={embed.id} padding="1.25rem">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              flexDirection: "row",
            }}
          >
            <div>
              <BillCard billId={embed.attributes?.billId as string} />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                flexDirection: "column",
                height: "100%",
              }}
            >
              <div style={{ textAlign: "right" }}>
                <p
                  style={{
                    color: "white",
                    fontSize: "16px",
                    margin: "0 0 0.5rem 0",
                  }}
                >
                  Last updated{" "}
                  {getRelativeTimeString(new Date(embed.updatedAt))}
                </p>
                <p
                  style={{
                    margin: 0,
                    color: "var(--blue-text)",
                    fontSize: "16px",
                  }}
                >
                  {embed.name}
                </p>
                <p style={{ color: "white", fontSize: "16px" }}>
                  {embed.description}
                </p>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: "1rem",
                }}
              >
                <Link href={`/dashboard/${slug}/embeds/${embed.id}`}>
                  <Button variant="secondary" size="medium" label="Edit" />
                </Link>
                <Button
                  variant="secondary"
                  size="medium"
                  label="Copy Embed Code"
                />
              </div>
            </div>
          </div>
        </Box>
        // </Link>
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
