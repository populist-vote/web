import { Badge } from "components/Badge/Badge";
import { Box } from "components/Box/Box";
import styles from "./Dashboard.module.scss";
import {
  EmbedType,
  EmbedsCountResult,
  useEmbedsActivityQuery,
  useEmbedsDeploymentsQuery,
  useTotalCandidateGuideSubmissionsQuery,
} from "generated";
import Link from "next/link";
import { useRouter } from "next/router";
import { LoaderFlag } from "components/LoaderFlag/LoaderFlag";
import { Theme } from "hooks/useTheme";

import { DeploymentsList } from "components/DeploymentsList/DeploymentsList";

export const EmbedTypeColorMap: Record<EmbedType, Theme> = {
  LEGISLATION: "yellow",
  LEGISLATION_TRACKER: "green",
  POLITICIAN: "aqua",
  RACE: "blue",
  QUESTION: "orange",
  POLL: "violet",
  CANDIDATE_GUIDE: "aqua",
};

export function Dashboard({ organizationId }: { organizationId: string }) {
  const { data, isLoading } = useEmbedsActivityQuery({
    id: organizationId,
  });

  const activity = data?.embedsActivity as EmbedsCountResult[];

  const {
    data: candidateGuideSubmissionsData,
    isLoading: candidateGuideSubmissionsLoading,
  } = useTotalCandidateGuideSubmissionsQuery({
    organizationId,
  });

  if (isLoading || candidateGuideSubmissionsLoading)
    return (
      <div className={styles.centered}>
        <LoaderFlag />
      </div>
    );

  return (
    <div className={styles.container}>
      <ActivityTiles
        activity={activity}
        totalCandidateGuideSubmissions={
          candidateGuideSubmissionsData?.totalCandidateGuideSubmissions || 0
        }
      />
      <RecentDeployments organizationId={organizationId} />
    </div>
  );
}

function ActivityTiles({
  activity,
  totalCandidateGuideSubmissions,
}: {
  activity: EmbedsCountResult[];
  totalCandidateGuideSubmissions: number;
}) {
  const { query } = useRouter();
  return (
    <section>
      <h2 style={{ textAlign: "center" }}>Activity</h2>
      <div className={styles.tiles}>
        {activity?.map((embedCounts) => {
          const embedType = embedCounts.embedType;
          const theme = EmbedTypeColorMap[embedCounts.embedType];
          return (
            <Box key={embedType}>
              <div className={styles.tile}>
                <Link
                  href={`/dashboard/${query.dashboardSlug}/embeds/${embedType
                    .replace("_", "-")
                    .toLowerCase()}`}
                  passHref
                >
                  <Badge theme={theme} size="large" variant="solid" clickable>
                    {embedType.replace("_", " ")}
                  </Badge>
                </Link>
                {(embedType == EmbedType.Poll ||
                  embedType == EmbedType.Question) && (
                  <div>
                    <h1>{embedCounts.submissions}</h1>
                    <h4 style={{ color: `var(--${theme})` }}>Submissions</h4>
                  </div>
                )}
                {embedType == EmbedType.CandidateGuide && (
                  <div>
                    <h1>{totalCandidateGuideSubmissions}</h1>
                    <h4 style={{ color: `var(--${theme})` }}>Submissions</h4>
                  </div>
                )}
                <div>
                  <div className={styles.dotSpread}>
                    <span>Embeds</span>
                    <span className={styles.dots} />
                    <span
                      style={{
                        color: `var(--${
                          theme == "blue" ? "blue-text" : theme
                        })`,
                      }}
                    >
                      {embedCounts.embedCount}
                    </span>
                  </div>
                  <div className={styles.dotSpread}>
                    <span>Deployments</span>
                    <span className={styles.dots} />
                    <span
                      style={{
                        color: `var(--${
                          theme == "blue" ? "blue-text" : theme
                        })`,
                      }}
                    >
                      {embedCounts.totalDeployments}
                    </span>
                  </div>
                </div>
              </div>
            </Box>
          );
        })}
      </div>
    </section>
  );
}

function RecentDeployments({ organizationId }: { organizationId: string }) {
  const { data, isLoading } = useEmbedsDeploymentsQuery(
    {
      id: organizationId,
    },
    {
      staleTime: 0,
    }
  );

  const deployments = data?.recentDeployments;

  if (isLoading)
    return (
      <div className={styles.centered}>
        <LoaderFlag />
      </div>
    );

  return (
    <section>
      <h2 style={{ textAlign: "center" }}>Recent Views</h2>
      <DeploymentsList deployments={deployments || []} />
    </section>
  );
}
