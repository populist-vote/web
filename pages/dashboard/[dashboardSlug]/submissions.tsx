import {
  Box,
  Button,
  Divider,
  Layout,
  LoaderFlag,
  SearchInput,
  Select,
} from "components";
import {
  PoliticalScope,
  RaceType,
  State,
  useCountiesByStateQuery,
  useSubmissionsQuery,
} from "generated";
import { useAuth } from "hooks/useAuth";
import nextI18nextConfig from "next-i18next.config";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { ReactNode, useMemo, useState } from "react";
import { SupportedLocale } from "types/global";
import { DashboardTopNav } from ".";
import { Table } from "components/Table/Table";
import useOrganizationStore from "hooks/useOrganizationStore";
import { submissionsColumns } from "./embeds/candidate-guide/[id]/submissions";
import styles from "../../../styles/modules/page.module.scss";
import { PoliticalScopeFilters } from "components/PoliticianFilters/PoliticianFilters";
import StateSelect from "components/StateSelect/StateSelect";

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

function Submissions() {
  const { user } = useAuth();
  const defaultState = user?.userProfile?.address?.state || "FEDERAL";
  const router = useRouter();
  const {
    search,
    scope,
    state = defaultState,
    county = "",
    raceType,
  } = router.query;
  const { organizationId } = useOrganizationStore();
  console.log("organizationId", organizationId);
  const [searchValue, setSearchValue] = useState(search as string);

  const { data, isLoading } = useSubmissionsQuery(
    {
      organizationId: organizationId as string,
      filter: {
        query: searchValue || null,
        politicalScope: (scope as PoliticalScope) || null,
        raceType: (raceType as RaceType) || null,
        state: (state == "FEDERAL" ? null : (state as State)) || null,
        county: (county as string) || null,
      },
    },
    {
      enabled: !!organizationId,
    }
  );

  const { data: countiesData, isLoading: areCountiesLoading } =
    useCountiesByStateQuery({
      state: state as State,
    });

  const submissions = data?.submissions || [];
  const columns = useMemo(() => submissionsColumns({}), []);

  const hasFilters =
    !!searchValue || !!raceType || !!county || state !== defaultState;

  const handleClearFilters = () => {
    setSearchValue("");
    void router.push({ query: { dashboardSlug: router.query.dashboardSlug } });
  };

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        marginTop: "1.5rem",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
      }}
    >
      <Box>
        <div style={{ gap: "1rem", display: "flex", flexDirection: "column" }}>
          <SearchInput
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            placeholder="Search by candidate name, race, or office"
            searchId="submissions"
          />
          <div
            className={styles.flexBetween}
            style={{ gap: "1rem", width: "100%" }}
          >
            <div className={styles.flexBetween} style={{ gap: "1rem" }}>
              <PoliticalScopeFilters />
              <Divider vertical />
              <StateSelect
                handleStateChange={(state) =>
                  router.push({ query: { ...router.query, state } })
                }
                defaultState={defaultState}
              />
              <Select
                textColor="white"
                backgroundColor={"transparent"}
                border="solid"
                accentColor="blue"
                value={raceType as string}
                options={[
                  { value: "", label: "Race Type" },
                  { value: RaceType.General, label: "General" },
                  { value: RaceType.Primary, label: "Primary" },
                ]}
                onChange={(e) =>
                  void router.push({
                    query: { ...router.query, raceType: e.target.value },
                  })
                }
              />
              {state && !areCountiesLoading && (
                <Select
                  textColor="white"
                  backgroundColor={"transparent"}
                  border="solid"
                  accentColor="blue"
                  value={county as string}
                  options={[
                    { value: "", label: "County" },
                    ...(countiesData?.countiesByState.map((county) => ({
                      value: county,
                      label: county,
                    })) || []),
                  ]}
                  onChange={(e) =>
                    void router.push({
                      query: { ...router.query, county: e.target.value },
                    })
                  }
                />
              )}
            </div>
            {hasFilters && (
              <Button
                size="small"
                onClick={handleClearFilters}
                label="Clear Filters"
                theme="red"
                variant="secondary"
              />
            )}
          </div>
        </div>
      </Box>
      {isLoading ? (
        <div className={styles.center} style={{ height: "100%" }}>
          <LoaderFlag />
        </div>
      ) : submissions.length > 0 ? (
        <Table
          // @ts-expect-error react-table
          columns={columns}
          data={submissions}
          initialState={{
            sorting: [{ id: "createdAt", desc: true }],
            pagination: { pageSize: 10 },
          }}
          theme="blue"
        />
      ) : (
        <div className={styles.center} style={{ height: "100%" }}>
          <span className={styles.noResults}>No submissions found</span>
        </div>
      )}
    </div>
  );
}

Submissions.getLayout = (page: ReactNode) => (
  <Layout>
    <DashboardTopNav />
    {page}
  </Layout>
);

export default Submissions;
