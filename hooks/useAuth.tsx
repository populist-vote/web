import { AuthTokenResult, Role, useCurrentUserQuery } from "../generated";
import Router from "next/router";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

const AuthContext = createContext<AuthTokenResult>({} as AuthTokenResult);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data, isLoading, error } = useCurrentUserQuery();
  if (isLoading || error) return null;

  return (
    <AuthContext.Provider value={data?.currentUser as AuthTokenResult}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth({
  redirectTo = "/login",
  minRole = Role.Basic,
  organizationId = null,
  redirect = true,
}: {
  redirectTo?: string;
  minRole?: Role;
  organizationId?: null | string;
  redirect?: boolean;
} = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const user = useContext(AuthContext);

  useEffect(() => {
    setIsLoading(true);
    if (redirect && !user) {
      void Router.push(redirectTo);
    }

    if (user) {
      if (organizationId && user.organizationId !== organizationId) {
        void Router.push(redirectTo);
      }

      switch (user.role) {
        case Role.Superuser:
          return;
        case Role.Staff:
          if (minRole === Role.Staff) return;
        case Role.Premium:
          if (minRole === Role.Premium) return;
        case Role.Basic:
          if (minRole === Role.Basic) return;
        default:
          void Router.push(redirectTo);
      }
    }
    setIsLoading(false);
  }, [user, redirectTo, minRole, redirect, organizationId]);

  return { user, isLoading };
}
