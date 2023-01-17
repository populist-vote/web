import { BasicLayout } from "components";
import { AddressStep } from "components/Auth/Register/AddressStep";
import { StateMachineProvider } from "little-state-machine";
import nextI18NextConfig from "next-i18next.config";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { SupportedLocale } from "global";

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
        nextI18NextConfig
      )),
    },
  };
}

function Register() {
  return (
    <StateMachineProvider>
      <BasicLayout hideFooter>
        <AddressStep />
      </BasicLayout>
    </StateMachineProvider>
  );
}

export default Register;
