import { useCurrentUserQuery } from "generated";
import { useRouter } from "next/router";

export function useInviteSession() {
  const router = useRouter();
  const inviteToken =
    typeof router.query.inviteToken === "string"
      ? router.query.inviteToken
      : "";
  const invitedEmail =
    typeof router.query.email === "string" ? router.query.email.trim() : "";
  const session = useCurrentUserQuery(undefined, {
    enabled: router.isReady && !!inviteToken,
    // A cached account can belong to a session changed in another tab.
    refetchOnMount: "always",
    refetchOnWindowFocus: "always",
    staleTime: 0,
  });
  const user = session.data?.currentUser;
  const isChecking =
    !router.isReady ||
    (!!inviteToken && (!session.isFetchedAfterMount || session.isPending));
  // The email in the link guides the UI only. The API still validates the
  // token's recipient before accepting an invitation. Keep + aliases distinct.
  const isMismatch =
    !!inviteToken &&
    !!invitedEmail &&
    !!user &&
    user.email.trim().toLowerCase() !== invitedEmail.toLowerCase();

  return { user, invitedEmail, isChecking, isMismatch };
}
