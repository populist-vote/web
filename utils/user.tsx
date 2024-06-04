import { AuthTokenResult, Role } from "generated";

export function isPremium(user: AuthTokenResult | null): boolean {
  if (!user || !user?.role) return false;
  return (
    user?.role === Role.Premium ||
    user?.role === Role.Staff ||
    user?.role === Role.Superuser
  );
}
