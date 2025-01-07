import { useOrganizationByIdQuery } from "generated";
import useOrganizationStore from "hooks/useOrganizationStore";
import Link from "next/link";

export function OrganizationDashboardLink({ text }: { text: string }) {
  const { organizationId } = useOrganizationStore();
  const { data: organizationData } = useOrganizationByIdQuery(
    {
      id: organizationId as string,
    },
    {
      enabled: !!organizationId,
    }
  );
  const dashboardSlug = organizationData?.organizationById?.slug;

  if (!organizationId) {
    return (
      <>
        {text}
        {"  "}
        <Link
          href="mailto:info@populist.us?subject=I'm%20interested%20in%20Populist"
          style={{
            color: "var(--blue-text)",
            textDecoration: "dotted underline",
          }}
        >
          Contact sales to get started with Populist for organizations.
        </Link>
      </>
    );
  }

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
