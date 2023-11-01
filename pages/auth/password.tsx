import { ResetPasswordForm } from "components/Auth/PasswordForm";
import { SupportedLocale } from "types/global";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import nextI18nextConfig from "next-i18next.config";
import { ReactNode } from "react";
import { BasicLayout } from "components";

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
        nextI18nextConfig
      )),
    },
  };
}

const PasswordPage = () => <ResetPasswordForm />;

PasswordPage.getLayout = (page: ReactNode) => (
  <BasicLayout hideFooter hideAuthButtons>
    {page}
  </BasicLayout>
);

export default PasswordPage;
