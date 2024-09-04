import { Button, Divider, Layout } from "components";
import { BillSearchAndFilters } from "components/BillFilters/BillSearchAndFilters";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { ReactNode } from "react";
import { SupportedLocale } from "types/global";
import { DashboardTopNav } from "../..";
import nextI18nextConfig from "next-i18next.config";
import { useRouter } from "next/router";
import {
  useUpsertEmbedMutation,
  EmbedType,
  useOrganizationBySlugQuery,
} from "generated";
import { toast } from "react-toastify";
import { BillResultsTable } from "components/BillResultsTable/BillResultsTable";

export async function getServerSideProps({
  query,
  locale,
}: {
  query: { dashboardSlug: string };
  locale: SupportedLocale;
}) {
  return {
    props: {
      dashboardSlug: query.dashboardSlug,
      ...(await serverSideTranslations(
        locale,
        ["auth", "common"],
        nextI18nextConfig
      )),
    },
  };
}

function NewLegislationEmbed() {
  const router = useRouter();
  const { query } = router;
  const { dashboardSlug, selected, embedId } = query;
  const { data: organizationData } = useOrganizationBySlugQuery(
    {
      slug: dashboardSlug as string,
    },
    {
      enabled: !!dashboardSlug,
    }
  );
  const currentOrganizationId = organizationData?.organizationBySlug?.id;
  const upsertEmbed = useUpsertEmbedMutation();

  const handleCreateEmbed = () => {
    upsertEmbed.mutate(
      {
        input: {
          id: embedId as string,
          name: "Legislation Embed",
          embedType: EmbedType.Legislation,
          organizationId: currentOrganizationId as string,
          attributes: {
            billId: selected as string,
            embedType: "legislation",
          },
        },
      },
      {
        onSuccess: (data) => {
          toast("Embed saved!", { type: "success", position: "bottom-right" });
          void router.push(
            `/dashboard/${dashboardSlug}/embeds/legislation/${data.upsertEmbed.id}/manage`,
            undefined,
            {
              shallow: true,
            }
          );
        },
      }
    );
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1>New Legislation Embed</h1>
        <Button
          size="large"
          variant="secondary"
          label={"Create Embed"}
          disabled={!selected}
          onClick={handleCreateEmbed}
        />
      </div>
      <p>Search and select legislation to embed on your page.</p>
      <BillSearchAndFilters theme={"yellow"} />
      <Divider />
      <BillResultsTable theme={"yellow"} />
    </>
  );
}

NewLegislationEmbed.getLayout = (page: ReactNode) => (
  <Layout>
    <DashboardTopNav />
    {page}
  </Layout>
);

export default NewLegislationEmbed;
