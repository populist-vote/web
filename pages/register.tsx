import { Register, RegisterStep } from "components/Auth/Register/Register";
import { GetServerSideProps, NextPage } from "next";
import { StateMachineProvider, createStore } from "little-state-machine";
import { BeginUserRegistrationInput } from "generated";

export const updateAction = (
  state: { signupFormState: BeginUserRegistrationInput },
  payload: Partial<BeginUserRegistrationInput>
) => {
  return {
    ...state,
    signupFormState: {
      ...state.signupFormState,
      ...payload,
    },
  };
};

export const SignUpPage: NextPage<{ step: RegisterStep }> = ({ step }) => {
  createStore({
    signupFormState: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      address: {
        line1: "",
        line2: "",
        city: "",
        state: "",
        postalCode: "",
        country: "",
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
