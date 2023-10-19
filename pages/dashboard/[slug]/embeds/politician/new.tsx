import { Button, Layout, PoliticianResultsTable } from "components";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { ReactNode, useState } from "react";
import { SupportedLocale } from "types/global";
import { DashboardTopNav } from "../..";
import nextI18nextConfig from "next-i18next.config";
import { useRouter } from "next/router";
import { useUpsertEmbedMutation, EmbedType } from "generated";
import { useAuth } from "hooks/useAuth";
import { toast } from "react-toastify";
import { Box } from "components/Box/Box";
import styles from "components/EmbedIndex/EmbedIndex.module.scss";
import { AiOutlineSearch } from "react-icons/ai";

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
  const { search } = router.query;
  const [searchValue, setSearchValue] = useState(search);

  function handleCreateEmbed() {
    upsertEmbed.mutate(
      {
        input: {
          id: embedId as string,
          name: "Politician Embed",
          embedType: EmbedType.Politician,
          populistUrl: "https://populist.us",
          organizationId: user?.organizationId as string,
          attributes: {
            politicianId: selected as string,
            renderOptions: {
              stats: true,
              endorsements: true,
              socials: true,
            },
          },
        },
      },
      {
        onSuccess: (data) => {
          toast("Embed saved!", { type: "success", position: "bottom-right" });
          void router.push(
            `/dashboard/${slug}/embeds/politician/${data.upsertEmbed.id}/manage`,
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
      <Box>
        <div className={styles.inputWithIcon}>
          <input
            placeholder="Search for politicians"
            onChange={(e) => {
              setSearchValue(e.target.value);
              if (e.target.value === "") {
                const { search: _, ...newQuery } = router.query;
                void router.push({
                  query: newQuery,
                });
              } else
                void router.push({
                  query: { ...router.query, search: e.target.value },
                });
            }}
            value={searchValue || ""}
          ></input>
          <AiOutlineSearch color="var(--blue)" size={"1.25rem"} />
        </div>
      </Box>
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
