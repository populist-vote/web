import { AuthTokenResult, useCurrentUserQuery } from "generated";
import Router from "next/router";
import { createContext, ReactNode, useContext, useEffect } from "react";

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

export function useAuth({ redirectTo = "/login" }: { redirectTo?: string } = {}) {
  const user = useContext(AuthContext);

  useEffect(() => {
    if (redirectTo && !user) void Router.push(redirectTo);
  }, [user, redirectTo]);

  return user;
}
