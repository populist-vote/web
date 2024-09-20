import {
  AuthTokenResult,
  SystemRoleType,
  useAvailableOrganizationsByUserQuery,
  useCurrentUserQuery,
} from "../generated";
import { useRouter } from "next/router";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { toast } from "react-toastify";
import useOrganizationStore from "./useOrganizationStore";

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
  minRole = SystemRoleType.User,
  organizationId = null,
}: {
  redirectTo?: string;
  minRole?: SystemRoleType;
  organizationId?: null | string;
} = {}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const user = useContext(AuthContext);
  const hasOrgs = user?.organizations.length > 0;
  const { initializeOrganization, setAvailableOrganizations } =
    useOrganizationStore();

  const { data: userData, isLoading: isAvailableOrgsDataLoading } =
    useAvailableOrganizationsByUserQuery(
      {
        userId: user?.id,
      },
      {
        enabled: !!user && hasOrgs,
      }
    );

  useEffect(() => {
    if (!isAvailableOrgsDataLoading && userData) {
      setAvailableOrganizations(
        userData.userProfile.availableOrganizations || []
      );
      initializeOrganization(
        userData.userProfile.availableOrganizations[0]?.id as string
      );
    }
  }, [
    userData,
    initializeOrganization,
    isAvailableOrgsDataLoading,
    setAvailableOrganizations,
  ]);

  useEffect(() => {
    setIsLoading(true);

    const handleRedirect = async () => {
      if (redirectTo) {
        if (!user) await router.push(redirectTo);

        if (user) {
          if (
            organizationId &&
            !user?.organizations.some(
              (o) => o.organizationId === organizationId
            )
          ) {
            await router.push(redirectTo);
          }

          // Init zustand organization store with current organization
          if (organizationId) {
            useOrganizationStore.setState({ organizationId });
          }

          switch (user.systemRole) {
            case SystemRoleType.Superuser:
              return;
            case SystemRoleType.Staff:
              if (minRole === SystemRoleType.Staff) return;
            case SystemRoleType.User:
              if (minRole === SystemRoleType.User) return;
            default:
              await router.push(redirectTo);
          }
        }
      }
    };

    handleRedirect()
      .catch((e) => toast(e))
      .finally(() => setIsLoading(false));

    return () => setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, redirectTo, minRole, organizationId]);

  return { user, isLoading };
}
