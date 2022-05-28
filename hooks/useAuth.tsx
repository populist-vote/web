import { useCurrentUserQuery } from "generated";
import Router from "next/router";
import { useEffect } from "react";

export function useAuth({ redirectTo = "/login" }) {
  const { data } = useCurrentUserQuery();

  useEffect(() => {
    if (!data?.currentUser) return;
    if (redirectTo && (!data || !data?.currentUser)) Router.push(redirectTo);
  }, [data, redirectTo]);

  return { user: data?.currentUser };
}
