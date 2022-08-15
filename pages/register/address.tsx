import { BasicLayout } from "components";
import { AddressStep } from "components/Auth/Register/AddressStep";
import { StateMachineProvider } from "little-state-machine";

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
