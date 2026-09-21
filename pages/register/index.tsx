import { createStore } from "little-state-machine";
import {
  BeginUserRegistrationInput,
  State,
  useCurrentUserQuery,
} from "generated";
import { EmailStep } from "components/Auth/Register/EmailStep";
import { BasicLayout, LoaderFlag } from "components";
import { useRouter } from "next/router";
import { SupportedLocale } from "types/global";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import nextI18nextConfig from "next-i18next.config";
import { ReactNode, useEffect } from "react";

export const updateAction = (
  state: { loginFormState: BeginUserRegistrationInput },
  payload: Partial<BeginUserRegistrationInput>,
) => {
  return {
    ...state,
    loginFormState: {
      ...state.loginFormState,
      ...payload,
    },
  };
};

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
        nextI18nextConfig,
      )),
    },
  };
}

function Register() {
  const router = useRouter();
  const { data, isLoading } = useCurrentUserQuery();
  const user = data?.currentUser;
  useEffect(() => {
    if (user) {
      void router.push(
        router.query.inviteToken
          ? { pathname: "/login", query: router.query }
          : `/${String(router.query.next || "home").replace(/^\/+/, "")}`,
      );
    }
  }, [user, router]);

  createStore({
    loginFormState: {
      email: "",
      password: "",
      address: {
        line1: "",
        line2: "",
        city: "",
        state: "" as State,
        postalCode: "",
        country: "USA",
      },
    },
  });

  if (isLoading) return <LoaderFlag height={100} />;

  return <EmailStep />;
}

Register.getLayout = (page: ReactNode) => (
  <BasicLayout hideFooter hideAuthButtons>
    {page}
  </BasicLayout>
);

export default Register;
