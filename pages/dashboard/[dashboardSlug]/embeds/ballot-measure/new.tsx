import { Button, Layout } from "components";
import { BallotMeasureSearch } from "components/BallotMeasureSearch/BallotMeasureSearch";
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
        nextI18nextConfig,
      )),
    },
  };
}

function NewBallotMeasureEmbed() {
  const router = useRouter();
  const { query } = router;
  const { dashboardSlug, selected, embedId } = query;
  const { data: organizationData } = useOrganizationBySlugQuery(
    {
      slug: dashboardSlug as string,
    },
    {
      enabled: !!dashboardSlug,
    },
  );
  const currentOrganizationId = organizationData?.organizationBySlug?.id;
  const upsertEmbed = useUpsertEmbedMutation();

  const handleCreateEmbed = () => {
    upsertEmbed.mutate(
      {
        input: {
          id: embedId as string,
          name: "Ballot Measure Embed",
          embedType: EmbedType.BallotMeasure,
          organizationId: currentOrganizationId as string,
          attributes: {
            ballotMeasureId: selected as string,
            renderOptions: {
              fullTextLink: true,
              scrollableDescription: false,
            },
          },
        },
      },
      {
        onSuccess: (data) => {
          toast("Embed saved!", { type: "success", position: "bottom-right" });
          void router.push(
            `/dashboard/${dashboardSlug}/embeds/ballot-measure/${data.upsertEmbed.id}/manage`,
          );
        },
        onError: () => {
          toast("Something went wrong creating this embed.", {
            type: "error",
            position: "bottom-right",
          });
        },
      },
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
        <h1>New Ballot Measure Embed</h1>
        <Button
          size="large"
          variant="secondary"
          label="Create Embed"
          disabled={!selected || upsertEmbed.isPending}
          onClick={handleCreateEmbed}
        />
      </div>
      <p>Search and select a ballot measure to embed on your page.</p>
      <BallotMeasureSearch />
    </>
  );
}

NewBallotMeasureEmbed.getLayout = (page: ReactNode) => (
  <Layout>
    <DashboardTopNav />
    {page}
  </Layout>
);

export default NewBallotMeasureEmbed;
