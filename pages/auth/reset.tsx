import { RequestResetForm } from "components/Auth/RequestResetForm";
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
      ...(await serverSideTranslations(
        locale,
        ["auth", "common"],
        nextI18nextConfig
      )),
    },
  };
}

const RequestResetPage = () => <RequestResetForm />;

RequestResetPage.getLayout = (page: ReactNode) => (
  <BasicLayout hideFooter hideAuthButtons>
    {page}
  </BasicLayout>
);

export default RequestResetPage;
