import { LogIn } from "components/Auth/LogIn/LogIn";
import type { NextPage } from "next";
import nextI18nextConfig from "next-i18next.config";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { SupportedLocale } from "types/global";

export async function getServerSideProps({
  locale,
}: {
  locale: SupportedLocale;
}) {
  return {
    props: {
      title: "Login",
      ...(await serverSideTranslations(locale, ["actions"], nextI18nextConfig)),
    },
  };
}

export const LogInPage: NextPage = () => {
  return <LogIn />;
};

export default LogInPage;
