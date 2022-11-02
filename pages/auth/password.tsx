import { NextPage } from "next";
import { ResetPasswordForm } from "components/Auth/PasswordForm";
import { SupportedLocale } from "types/global";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import nextI18nextConfig from "next-i18next.config";

export async function getServerSideProps({
  locale,
}: {
  locale: SupportedLocale;
}) {
  return {
    props: {
      title: "Reset Password",
      ...(await serverSideTranslations(locale, ["auth"], nextI18nextConfig)),
    },
  };
}

const PasswordPage: NextPage = () => {
  return <ResetPasswordForm />;
};

export default PasswordPage;
