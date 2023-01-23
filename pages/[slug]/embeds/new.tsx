import { Layout, TextInput } from "components";
import nextI18nextConfig from "next-i18next.config";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useForm } from "react-hook-form";
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

function EmbedsNew({ slug }: { slug: string }) {
  const navItems = dashboardNavItems(slug);
  const { register } = useForm();
  return (
    <Layout navItems={navItems}>
      <h2>New Embed</h2>
      <form>
        <TextInput
          name="name"
          id="name"
          label="Name"
          placeholder={"Name"}
          size="medium"
          hideLabel
          register={register}
        />
      </form>
    </Layout>
  );
}

export default EmbedsNew;
