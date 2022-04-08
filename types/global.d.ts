import { Address, AddressInput } from "generated";
import "little-state-machine";

declare module "little-state-machine" {
  interface GlobalState {
    signupFormState: {
      email: string;
      password: string;
      address: AddressInput;
    };
  }
}

type Nullable<T> = { [K in keyof T]: T[K] | null };
