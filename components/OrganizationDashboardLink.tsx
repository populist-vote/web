import { useOrganizationByIdQuery } from "generated";
import useOrganizationStore from "hooks/useOrganizationStore";
import Link from "next/link";

export function OrganizationDashboardLink({ text }: { text: string }) {
  const { organizationId } = useOrganizationStore();
  const { data: organizationData } = useOrganizationByIdQuery({
    id: organizationId as string,
  });
  const dashboardSlug = organizationData?.organizationById?.slug;

  return (
    <Link
      href={`/dashboard/${dashboardSlug}/conversations`}
      style={{
        color: "var(--blue-text)",
        textDecoration: "dotted underline",
      }}
    >
      {text}
    </Link>
  );
}
