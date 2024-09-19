import { Box, Layout, SearchInput, Select } from "components";
import nextI18nextConfig from "next-i18next.config";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { ReactNode, useState } from "react";
import { SupportedLocale } from "types/global";
import { DashboardTopNav } from "../..";
import { ElectionSearchResult } from "pages/elections/browse/[state]";
import { useAuth } from "hooks/useAuth";
import StateSelect from "components/StateSelect/StateSelect";
import { currentYear, yearOptions } from "utils/dates";
import {
  EmbedType,
  State,
  useElectionsIndexQuery,
  useUpsertEmbedMutation,
} from "generated";
import useOrganizationStore from "hooks/useOrganizationStore";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

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
        ["auth", "common", "embeds"],
        nextI18nextConfig
      )),
    },
  };
}

export default function NewMyBallotEmbed({
  dashboardSlug,
}: {
  dashboardSlug: string;
}) {
  const router = useRouter();
  const { user } = useAuth();
  const [searchValue, setSearchValue] = useState<string>(null!);
  const defaultState = user?.userProfile?.address?.state || "FEDERAL";
  const [state, setState] = useState<string>(defaultState);
  const [year, setYear] = useState<number>(currentYear);
  const { organizationId } = useOrganizationStore();

  const { data } = useElectionsIndexQuery({
    filter: {
      query: searchValue,
      state: state as State,
      year,
    },
  });

  const upsertEmbed = useUpsertEmbedMutation();

  const handleCreateEmbed = (electionId: string) => {
    upsertEmbed.mutate(
      {
        input: {
          name: "My Ballot Embed",
          embedType: EmbedType.MyBallot,
          organizationId,
          attributes: {
            electionId,
            embedType: "my-ballot",
          },
        },
      },
      {
        onSuccess: (data) => {
          toast("Embed saved!", { type: "success", position: "bottom-right" });
          void router.push(
            `/dashboard/${dashboardSlug}/embeds/my-ballot/${data.upsertEmbed.id}/manage`,
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
    <div>
      <h1>New My Ballot Embed</h1>
      <p>Search and choose an election to create a new My Ballot embed</p>
      <Box>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "1rem",
          }}
        >
          <StateSelect
            defaultState={defaultState}
            handleStateChange={(state) => setState(state)}
          />
          <Select
            textColor={"white"}
            backgroundColor="blue"
            options={yearOptions}
            value={year.toString()}
            onChange={(e) => setYear(parseInt(e.target.value))}
          />
          <SearchInput
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            searchId="newMyBallotEmbedElectionSearch"
            placeholder="Search for an election"
          />
        </div>
      </Box>
      <div
        style={{
          marginTop: "1rem",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        {data?.elections.map((election) => (
          <button
            onClick={() => handleCreateEmbed(election.id)}
            key={election.id}
            style={{ cursor: "pointer" }}
          >
            <ElectionSearchResult election={election} />
          </button>
        ))}
      </div>
    </div>
  );
}

NewMyBallotEmbed.getLayout = (page: ReactNode) => (
  <Layout>
    <DashboardTopNav />
    {page}
  </Layout>
);
