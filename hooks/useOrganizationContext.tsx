import { OrganizationResult, useOrganizationByIdQuery } from "../generated";
import { createContext, useContext, useState } from "react";
import { useAuth } from "./useAuth";
import { useQueries } from "@tanstack/react-query";

export interface OrganizationContextState {
  currentOrganizationId: string | null;
  setCurrentOrganizationId: (id: string) => void;
  availableOrganizations: OrganizationResult[];
}

const OrganizationContext = createContext<OrganizationContextState | undefined>(
  undefined
);

export function OrganizationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const availableOrganizationRoles = user?.organizations || [];

  const queries = useQueries({
    queries: availableOrganizationRoles?.map((org) => ({
      queryKey: ["organization", org.organizationId],
      queryFn: useOrganizationByIdQuery.fetcher({ id: org.organizationId }),
    })),
  });

  const isLoading = queries.some((query) => query.isLoading);
  const isError = queries.some((query) => query.isError);
  const data = queries.map((query) => query.data);

  const availableOrganizations = data.flatMap(
    (d) => d?.organizationById || []
  ) as OrganizationResult[];

  const lastUsedOrganizationId = localStorage.getItem("lastUsedOrganizationId");
  const [currentOrganizationId, setCurrentOrganizationId] = useState<
    string | null
  >(() => {
    if (lastUsedOrganizationId) return lastUsedOrganizationId;
    return availableOrganizationRoles[0]?.organizationId || null;
  });

  if (isLoading || isError) return null;

  return (
    <OrganizationContext.Provider
      value={{
        currentOrganizationId,
        setCurrentOrganizationId,
        availableOrganizations,
      }}
    >
      {children}
    </OrganizationContext.Provider>
  );
}

export const useOrganizationContext = () => {
  const context = useContext(OrganizationContext);
  if (!context) {
    throw new Error(
      "useOrganizationContext must be used within an OrganizationProvider"
    );
  }
  return context;
};
