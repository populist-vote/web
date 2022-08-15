import { StateMachineProvider, createStore } from "little-state-machine";
import { BeginUserRegistrationInput, State } from "generated";
import { EmailStep } from "components/Auth/Register/EmailStep";
import { BasicLayout } from "components";

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
      <BasicLayout hideFooter>
        <EmailStep />
      </BasicLayout>
    </StateMachineProvider>
  );
}

export default Register;
