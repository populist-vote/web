import { AddressInput } from "../../app/generated";
import "little-state-machine";

declare module "little-state-machine" {
  interface GlobalState {
    loginFormState: {
      email: string;
      password: string;
      address: AddressInput;
      test: string;
    };
  }
}

declare module "@tanstack/react-table" {
  interface TableMeta {
    updateData: (rowIndex: number, columnId: string, value: unknown) => void;
  }
}

type Nullable<T> = { [K in keyof T]: T[K] | null };

type AtLeast<T, K extends keyof T> = Partial<T> & Pick<T, K>;

export type SupportedLocale = "en" | "es" | "so" | "hmn";
