import { AddressInput } from "generated";
import "little-state-machine";

declare module "little-state-machine" {
  interface GlobalState {
    loginFormState: {
      email: string;
      password: string;
      address: AddressInput;
    };
  }
}

type Nullable<T> = { [K in keyof T]: T[K] | null };

type AtLeast<T, K extends keyof T> = Partial<T> & Pick<T, K>;
