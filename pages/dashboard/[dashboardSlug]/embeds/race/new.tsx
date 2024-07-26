import { Button, Layout } from "components";
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
import { Box } from "components/Box/Box";
import styles from "components/EmbedIndex/EmbedIndex.module.scss";
import { AiOutlineSearch } from "react-icons/ai";
import { RaceResultsTable } from "components/RaceResultsTable/RaceResultsTable";

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

export default function NewRaceEmbed({
  dashboardSlug,
}: {
  dashboardSlug: string;
}) {
  const router = useRouter();
  const { query } = router;
  const { selected, embedId } = query;
  const upsertEmbed = useUpsertEmbedMutation();
  const { search } = router.query;
  const [searchValue, setSearchValue] = useState(search);
  const { data: organizationData } = useOrganizationBySlugQuery(
    {
      slug: dashboardSlug as string,
    },
    {
      enabled: !!dashboardSlug,
    }
  );
  const currentOrganizationId = organizationData?.organizationBySlug?.id;

  function handleCreateEmbed() {
    upsertEmbed.mutate(
      {
        input: {
          id: embedId as string,
          name: "Race Embed",
          embedType: EmbedType.Race,
          organizationId: currentOrganizationId as string,
          attributes: {
            raceId: selected as string,
          },
        },
      },
      {
        onSuccess: (data) => {
          toast("Embed saved!", { type: "success", position: "bottom-right" });
          void router.push(
            `/dashboard/${dashboardSlug}/embeds/race/${data.upsertEmbed.id}/manage`,
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
        <h1>New Race Embed</h1>
        <Button
          size="large"
          variant="secondary"
          label={"Create Embed"}
          disabled={!selected}
          onClick={handleCreateEmbed}
        />
      </div>
      <p>Search and select a race to embed on your page.</p>
      <Box>
        <div className={styles.inputWithIcon}>
          <input
            placeholder="Try 'Minnesota Governor' or 'California Senate'"
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
      <RaceResultsTable />
    </>
  );
}

NewRaceEmbed.getLayout = (page: ReactNode) => (
  <Layout>
    <DashboardTopNav />
    {page}
  </Layout>
);
