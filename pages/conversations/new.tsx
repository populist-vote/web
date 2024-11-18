import { useEffect } from "react";
import { useRouter } from "next/router";

export default function NewConversationPage() {
  const router = useRouter();

  useEffect(() => {
    void router.replace("/conversations?new=true");
  }, [router]);

  return null;
}
