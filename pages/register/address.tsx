import { BasicLayout } from "components";
import { AddressStep } from "components/Auth/Register/AddressStep";
import { StateMachineProvider } from "little-state-machine";
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
      title: "Register",
      ...(await serverSideTranslations(locale, ["actions"], nextI18nextConfig)),
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
