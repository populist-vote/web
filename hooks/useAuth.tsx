import { AuthTokenResult, Role, useCurrentUserQuery } from "../generated";
import { useRouter } from "next/router";
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
  redirectTo,
  minRole = Role.Basic,
  organizationId = null,
}: {
  redirectTo?: string;
  minRole?: Role;
  organizationId?: null | string;
} = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const user = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    setIsLoading(true);

    const handleRedirect = async () => {
      if (redirectTo) {
        if (!user) await router.push(redirectTo);

        if (user) {
          if (organizationId && user?.organizationId !== organizationId) {
            await router.push(redirectTo);
          }
          setIsLoading(false);
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
              await router.push(redirectTo);
          }
        }
      }
    };

    void handleRedirect().finally(() => setIsLoading(false));

    return () => setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, redirectTo, minRole, organizationId]);

  return { user, isLoading };
}
