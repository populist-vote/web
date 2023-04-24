import { Button, Layout, PoliticianResultsTable } from "components";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { ReactNode } from "react";
import { SupportedLocale } from "types/global";
import { DashboardTopNav } from "../..";
import nextI18nextConfig from "next-i18next.config";
import { useRouter } from "next/router";
import { useUpsertEmbedMutation } from "generated";
import { useAuth } from "hooks/useAuth";
import { toast } from "react-toastify";

export async function getServerSideProps({
  query,
  locale,
}: {
  query: { slug: string };
  locale: SupportedLocale;
}) {
  return {
    props: {
      slug: query.slug,
      ...(await serverSideTranslations(
        locale,
        ["auth", "common"],
        nextI18nextConfig
      )),
    },
  };
}

function NewPoliticianEmbed() {
  const router = useRouter();
  const { query } = router;
  const { slug, selected, embedId } = query;
  const { user } = useAuth({ redirect: false });
  const upsertEmbed = useUpsertEmbedMutation();

  function handleCreateEmbed() {
    upsertEmbed.mutate(
      {
        input: {
          id: embedId as string,
          name: "Legislation Embed",
          populistUrl: "https://populist.us",
          organizationId: user?.organizationId as string,
          attributes: {
            politicianId: selected as string,
            embedType: "politician",
          },
        },
      },
      {
        onSuccess: (data) => {
          toast("Embed saved!", { type: "success", position: "bottom-right" });
          void router.push(
            `/dashboard/${slug}/embeds/politician/${data.upsertEmbed.id}`,
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
        <h1>New Politician Embed</h1>
        <Button
          size="large"
          variant="secondary"
          label={"Create Embed"}
          disabled={!selected}
          onClick={handleCreateEmbed}
        />
      </div>
      <p>Search and select a politician to embed on your page.</p>
      <PoliticianResultsTable />
    </>
  );
}

NewPoliticianEmbed.getLayout = (page: ReactNode) => (
  <Layout>
    <DashboardTopNav />
    {page}
  </Layout>
);

export default NewPoliticianEmbed;
