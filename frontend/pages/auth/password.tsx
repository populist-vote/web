import { NextPage } from "next";
import { ResetPasswordForm } from "components/Auth/PasswordForm";
import { SupportedLocale } from "global";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import nextI18NextConfig from "next-i18next.config";

export async function getServerSideProps({
  locale,
}: {
  locale: SupportedLocale;
}) {
  return {
    props: {
      title: "Reset Password",
      ...(await serverSideTranslations(
        locale,
        ["auth", "common"],
        nextI18NextConfig
      )),
    },
  };
}

const PasswordPage: NextPage = () => {
  return <ResetPasswordForm />;
};

export default PasswordPage;
