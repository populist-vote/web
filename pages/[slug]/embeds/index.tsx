import { Button, Layout } from "components";
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

function EmbedsIndex({ slug }: { slug: string }) {
  const router = useRouter();
  const navItems = dashboardNavItems(slug);
  return (
    <Layout navItems={navItems}>
      <h2>Embeds</h2>
      <Button
        variant="primary"
        size="medium"
        onClick={() => router.push(`${router.asPath}/new`)}
        label="New Embed"
      />
    </Layout>
  );
}

export default EmbedsIndex;
