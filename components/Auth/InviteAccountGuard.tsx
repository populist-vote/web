import { LoaderFlag } from "components/LoaderFlag/LoaderFlag";
import { useInviteSession } from "hooks/useInviteSession";
import { useRouter } from "next/router";
import { PropsWithChildren, useEffect } from "react";

function InviteSessionGate({ children }: PropsWithChildren) {
  const router = useRouter();
  const { isChecking, isMismatch } = useInviteSession();

  useEffect(() => {
    if (!isChecking && isMismatch) {
      void router.replace({
        pathname: "/auth/invite-account",
        query: router.query,
      });
    }
  }, [isChecking, isMismatch, router]);

  if (isChecking || isMismatch) return <LoaderFlag height={100} />;
  return <>{children}</>;
}

export function InviteAccountGuard({ children }: PropsWithChildren) {
  const { query } = useRouter();
  // Recheck when another invitation is opened without a full page navigation.
  return (
    <InviteSessionGate key={`${query.inviteToken}:${query.email}`}>
      {children}
    </InviteSessionGate>
  );
}
