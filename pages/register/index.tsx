import { StateMachineProvider, createStore } from "little-state-machine";
import {
  BeginUserRegistrationInput,
  State,
  useCurrentUserQuery,
} from "generated";
import { EmailStep } from "components/Auth/Register/EmailStep";
import { BasicLayout, LoaderFlag } from "components";
import { useRouter } from "next/router";

export const updateAction = (
  state: { loginFormState: BeginUserRegistrationInput },
  payload: Partial<BeginUserRegistrationInput>
) => {
  return {
    ...state,
    loginFormState: {
      ...state.loginFormState,
      ...payload,
    },
  };
};

function Register() {
  const router = useRouter();
  const { data, isLoading } = useCurrentUserQuery();
  const user = data?.currentUser;
  if (user) void router.push(`/${router.query.next || "/home"}`);

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

  return (
    <StateMachineProvider>
      <BasicLayout hideFooter>
        <EmailStep />
      </BasicLayout>
    </StateMachineProvider>
  );
}

export default Register;
