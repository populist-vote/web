import { BasicLayout } from "components";
import { AddressStep } from "components/Auth/Register/AddressStep";
import { StateMachineProvider } from "little-state-machine";
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
      title: "Register",
      ...(await serverSideTranslations(
        locale,
        ["auth", "common"],
        nextI18nextConfig
      )),
    },
  };
}

function Register() {
  return (
    <StateMachineProvider>
      <AddressStep />
    </StateMachineProvider>
  );
}

Register.getLayout = (page: ReactNode) => (
  <BasicLayout hideFooter>{page}</BasicLayout>
);

export default Register;
