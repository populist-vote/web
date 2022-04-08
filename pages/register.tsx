import { Register, RegisterStep } from "components/Auth/Register/Register";
import { GetServerSideProps, NextPage } from "next";
import { StateMachineProvider, createStore } from "little-state-machine";
import { BeginUserRegistrationInput, State } from "generated";

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

export const SignUpPage: NextPage<{ step: RegisterStep }> = ({ step }) => {
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

  return (
    <StateMachineProvider>
      <Register step={step} />
    </StateMachineProvider>
  );
};

export default SignUpPage;

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  return {
    props: {
      step: query.step ?? "email",
    },
  };
};
