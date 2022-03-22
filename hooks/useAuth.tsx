import { useCurrentUserQuery, UserResult } from "generated";
import { createContext, ReactNode, useContext } from "react";

const AuthContext = createContext<UserResult | null>(null);

export function AuthContextProvider({ children }: { children: ReactNode }) {
  const { data } = useCurrentUserQuery();

  return (
    <AuthContext.Provider value={data?.currentUser || null}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("useAuth must be used within an AuthContextProvider");
  }
  return authContext;
}
