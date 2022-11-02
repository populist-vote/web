import { NextPage } from "next";
import { RequestResetForm } from "components/Auth/RequestResetForm";
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
      ...(await serverSideTranslations(locale, ["auth"], nextI18nextConfig)),
    },
  };
}

const RequestResetPage: NextPage = () => {
  return <RequestResetForm />;
};

export default RequestResetPage;
