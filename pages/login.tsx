import { BasicLayout } from "components";
import { LogIn } from "components/Auth/LogIn/LogIn";
import nextI18nextConfig from "next-i18next.config";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { ReactNode } from "react";
import { SupportedLocale } from "types/global";

export async function getServerSideProps({
  locale,
}: {
  locale: SupportedLocale;
}) {
  return {
    props: {
      title: "Sign In",
      ...(await serverSideTranslations(
        locale,
        ["auth", "common"],
        nextI18nextConfig
      )),
    },
  };
}

function LoginPage() {
  return <LogIn />;
}

LoginPage.getLayout = (page: ReactNode) => (
  <BasicLayout hideFooter hideAuthButtons>
    {page}
  </BasicLayout>
);

export default LoginPage;
