import { Layout, TextInput } from "components";
import nextI18nextConfig from "next-i18next.config";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { SupportedLocale } from "types/global";
import { dashboardNavItems } from "utils/nav";

export async function getServerSideProps({
  locale,
}: {
  locale: SupportedLocale;
}) {
  return {
    props: {
      ...(await serverSideTranslations(
        locale,
        ["auth", "common"],
        nextI18nextConfig
      )),
    },
  };
}

function EmbedsNew() {
  const router = useRouter();
  const navItems = dashboardNavItems(router);
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
