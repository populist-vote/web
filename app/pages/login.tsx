import { LogIn } from "components/Auth/LogIn/LogIn";
import type { NextPage } from "next";
import nextI18NextConfig from "utils/next-i18next.config";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { SupportedLocale } from "global";

export async function getServerSideProps({
  locale,
}: {
  locale: SupportedLocale;
}) {
  return {
    props: {
      title: "Login",
      ...(await serverSideTranslations(
        locale,
        ["auth", "common"],
        nextI18NextConfig
      )),
    },
  };
}

export const LogInPage: NextPage = () => {
  return <LogIn />;
};

export default LogInPage;
