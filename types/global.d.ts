import { Address } from "generated";
import "little-state-machine";

declare module "little-state-machine" {
  interface GlobalState {
    signupFormState: {
      email: string;
      password: string;
      address: Address;
    };
  }
}
