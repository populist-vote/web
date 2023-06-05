import { AddressInput, InputMaybe } from "generated";
import "little-state-machine";
import { FilterFn } from "@tanstack/react-table";

declare module "little-state-machine" {
  interface GlobalState {
    loginFormState: {
      email: string;
      password: string;
      address?: InputMaybe<AddressInput>;
    };
  }
}

declare module "@tanstack/react-table" {
  interface TableMeta {
    updateData: (rowIndex: number, columnId: string, value: unknown) => void;
  }
}

declare module "@tanstack/table-core" {
  interface FilterFns {
    fuzzy: FilterFn<unknown>;
  }
  interface FilterMeta {
    itemRank: RankingInfo;
  }
}

type Nullable<T> = { [K in keyof T]: T[K] | null };

type AtLeast<T, K extends keyof T> = Partial<T> & Pick<T, K>;

export type SupportedLocale = "en" | "es" | "so" | "hmn";
