import { Button, Layout } from "components";
import { BillSearchAndFilters } from "components/BillFilters/BillSearchAndFilters";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { ReactNode, useState } from "react";
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
import { Box } from "components/Box/Box";
import styles from "components/Layout/Layout.module.scss";
import { Badge } from "components/Badge/Badge";
import { BsXCircleFill } from "react-icons/bs";

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

function NewLegislationEmbed({ dashboardSlug }: { dashboardSlug: string }) {
  const router = useRouter();
  const { query } = router;
  const { embedId } = query;
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
  const [selectedBills, setSelectedBills] = useState<
    {
      id: string;
      billNumber: string;
    }[]
  >([]);

  function handleCreateEmbed() {
    upsertEmbed.mutate(
      {
        input: {
          id: embedId as string,
          name: "Legislation Tracker Embed",
          embedType: EmbedType.LegislationTracker,
          organizationId: currentOrganizationId as string,
          attributes: {
            billIds: selectedBills.map((b) => b.id),
            embedType: "legislation-tracker",
          },
        },
      },
      {
        onSuccess: (data) => {
          toast("Embed saved!", { type: "success", position: "bottom-right" });
          void router.push(
            `/dashboard/${dashboardSlug}/embeds/legislation-tracker/${data.upsertEmbed.id}/manage`,
            undefined,
            {
              shallow: true,
            }
          );
        },
      }
    );
  }
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1>New Legislation Tracker Embed</h1>
        <Button
          size="large"
          variant="secondary"
          label={"Create Embed"}
          disabled={!selectedBills.length}
          onClick={handleCreateEmbed}
        />
      </div>
      <p>Search and select legislation to embed on your page.</p>
      <BillSearchAndFilters theme={"yellow"} />
      <br />
      <Box>
        {selectedBills.length > 0 ? (
          <div className={styles.flexLeft} style={{ gap: "1rem" }}>
            {selectedBills.map((bill: { id: string; billNumber: string }) => (
              <Badge key={bill.id}>
                {bill.billNumber}
                <BsXCircleFill
                  color="var(--grey)"
                  onClick={() =>
                    setSelectedBills(
                      selectedBills.filter((b) => b.id !== bill.id)
                    )
                  }
                />
              </Badge>
            ))}
          </div>
        ) : (
          <p className={styles.noResults}>No legislation selected</p>
        )}
      </Box>
      <br />
      <BillResultsTable theme={"yellow"} setSelectedBills={setSelectedBills} />
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
