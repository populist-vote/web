import { Button, Layout } from "components";
import { TopNav } from "components/TopNav/TopNav";
import { useOrganizationBySlugQuery } from "generated";
import { useAuth } from "hooks/useAuth";
import nextI18nextConfig from "next-i18next.config";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Link from "next/link";
import { useRouter } from "next/router";
import { BillFiltersParams } from "pages/bills";
import { SupportedLocale } from "types/global";
import { MdSpaceDashboard } from "react-icons/md";
import { BiCodeBlock } from "react-icons/bi";
import { ReactNode, useState } from "react";
import { useTheme } from "hooks/useTheme";
import { LAST_SELECTED_EMBED_TYPE } from "utils/constants";
import { BsPeopleFill } from "react-icons/bs";
import { Dashboard } from "components/Dashboard/Dashboard";
import { NewEmbedModal } from "components/NewEmbedModal/NewEmbedModal";

export async function getServerSideProps({
  query,
  locale,
}: {
  query: { dashboardSlug: string } & BillFiltersParams;
  locale: SupportedLocale;
}) {
  return {
    props: {
      dashboardSlug: query.dashboardSlug,
      ...(await serverSideTranslations(
        locale,
        ["auth", "common", "embeds"],
        nextI18nextConfig
      )),
    },
  };
}

export default function DashboardIndex({
  dashboardSlug,
}: {
  dashboardSlug: string;
}) {
  const organizationQuery = useOrganizationBySlugQuery(
    {
      slug: dashboardSlug,
    },
    {
      enabled: !!dashboardSlug,
    }
  );

  const organizationId = organizationQuery.data?.organizationBySlug
    ?.id as string;

  const { isLoading } = useAuth({
    redirectTo: `/login?next=dashboard/${dashboardSlug}`,
    organizationId,
  });
  return organizationQuery.isLoading || isLoading ? null : (
    <Dashboard organizationId={organizationId} />
  );
}

export function DashboardTopNav() {
  const router = useRouter();
  const { theme } = useTheme();
  const { dashboardSlug } = router.query;
  const [isNewEmbedModalOpen, setIsNewEmbedModalOpen] = useState(false);
  return (
    <TopNav>
      <NewEmbedModal
        dashboardSlug={dashboardSlug as string}
        isOpen={isNewEmbedModalOpen}
        onClose={() => setIsNewEmbedModalOpen(false)}
      />
      <ul>
        <li
          data-selected={router.asPath == `/dashboard/${dashboardSlug}`}
          data-color={theme}
        >
          <Link
            href={{
              pathname: "/dashboard/[dashboardSlug]",
              query: { dashboardSlug },
            }}
          >
            <MdSpaceDashboard /> Dashboard
          </Link>
        </li>
        <li
          data-selected={new RegExp(`/dashboard/${dashboardSlug}/embeds`).test(
            router.asPath
          )}
          data-color={theme}
        >
          <Link
            href={{
              pathname: `/dashboard/[dashboardSlug]/embeds/${
                localStorage.getItem(LAST_SELECTED_EMBED_TYPE) || "legislation"
              }`,
              query: { dashboardSlug },
            }}
          >
            <BiCodeBlock /> Embeds
          </Link>
        </li>
        <li
          data-selected={
            router.asPath == `/dashboard/${dashboardSlug}/audience`
          }
          data-color={theme}
        >
          <Link
            href={{
              pathname: "/dashboard/[dashboardSlug]/audience",
              query: { dashboardSlug },
            }}
          >
            <BsPeopleFill /> Audience
          </Link>
        </li>
      </ul>
      <div>
        <Button
          variant="primary"
          size="medium"
          theme={theme}
          label="New Embed"
          wrapText={false}
          onClick={() => setIsNewEmbedModalOpen(true)}
        />
      </div>
    </TopNav>
  );
}

DashboardIndex.getLayout = (page: ReactNode) => (
  <Layout>
    <DashboardTopNav />
    {page}
  </Layout>
);
