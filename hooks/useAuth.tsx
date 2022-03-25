import { useCurrentUserQuery } from "generated";
import Router from "next/router";
import { useEffect } from "react";

export function useAuth({ redirectTo = "" }) {
  const { data } = useCurrentUserQuery();

  useEffect(() => {
    if (!data) return;
    if (redirectTo && !data?.currentUser) Router.push(redirectTo);
  }, [data, redirectTo]);

  return { user: data?.currentUser };
}
