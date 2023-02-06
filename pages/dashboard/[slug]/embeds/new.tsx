import { Button, Layout } from "components";
import { Box } from "components/Box/Box";
import nextI18nextConfig from "next-i18next.config";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Link from "next/link";
import { ReactNode } from "react";
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

function EmbedsNew({ slug }: { slug: string }) {
  return (
    <>
      <Box width="50%">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            textAlign: "center",
            alignContent: "center",
          }}
        >
          <h2>New Embed</h2>
          <p style={{ fontSize: "16px" }}>
            Select the type of content you'd like to embed.
          </p>
          <Link
            href="/dashboard/[slug]/embeds/legislation"
            as={`/dashboard/${slug}/embeds/legislation`}
          >
            <Button variant="super" size="large" label="Legislation" />
          </Link>
          <br />
          <Button
            variant="super"
            size="large"
            label="Politician (coming soon)"
            disabled
          />
          <br />
          <Button
            variant="super"
            size="large"
            label="Poll (coming soon)"
            disabled
          />
        </div>
      </Box>
    </>
  );
}

EmbedsNew.getLayout = (page: ReactNode) => (
  <Layout>
    <DashboardTopNav />
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        width: "100%",
      }}
    >
      {page}
    </div>
  </Layout>
);

export default EmbedsNew;
