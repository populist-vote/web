import { Badge } from "components/Badge/Badge";
import { Box } from "components/Box/Box";
import styles from "./Dashboard.module.scss";
import {
  EmbedType,
  EmbedsCountResult,
  EnhancedEmbedOriginResult,
  useEmbedsActivityQuery,
  useEmbedsDeploymentsQuery,
  useTotalCandidateGuideSubmissionsQuery,
} from "generated";
import Link from "next/link";
import { useRouter } from "next/router";
import { LoaderFlag } from "components/LoaderFlag/LoaderFlag";
import { ImageWithFallback } from "components/ImageWithFallback/ImageWithFallback";
import { getRelativeTimeString } from "utils/dates";
import { BsCodeSquare, BsEyeglasses } from "react-icons/bs";
import { Theme } from "hooks/useTheme";
import { Tooltip } from "components/Tooltip/Tooltip";
import { kebabCase } from "utils/strings";

const EmbedTypeColorMap: Record<EmbedType, Theme> = {
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
  const router = useRouter();
  const dashboardSlug = router.query.dashboardSlug as string;

  const { data, isLoading } = useEmbedsDeploymentsQuery({
    id: organizationId,
  });

  const deployments = data?.recentDeployments;

  if (isLoading)
    return (
      <div className={styles.centered}>
        <LoaderFlag />
      </div>
    );

  return (
    <section>
      <h2 style={{ textAlign: "center" }}>Recent Deployments</h2>
      <div className={styles.deployments}>
        {deployments?.length == 0 && (
          <small className={styles.noResults}>No deployments</small>
        )}

        {deployments?.map((deployment: EnhancedEmbedOriginResult) => (
          <div className={styles.deploymentRow} key={deployment.url}>
            <h3>{deployment.name}</h3>
            <Badge
              theme={EmbedTypeColorMap[deployment.embedType]}
              size="small"
              variant="solid"
            >
              {deployment.embedType.replace("_", " ")}
            </Badge>

            <div
              style={{
                display: "flex",
                gap: "1rem",
                alignItems: "center",
                wordBreak: "break-all",
              }}
            >
              <ImageWithFallback
                height="25"
                width="25"
                alt={"favicon"}
                src={`https://www.google.com/s2/favicons?domain=${deployment.url}`}
                fallbackSrc={"/images/favicon.ico"}
              />
              <Link
                href={deployment.url}
                key={`${deployment.embedId + deployment.url}`}
                target="_blank"
                rel="noreferrer"
                className={styles.linkParent}
              >
                {deployment.url}
              </Link>
            </div>
            {deployment.lastPingAt && (
              <div className={styles.flexRight}>
                <BsEyeglasses />
                <small>
                  Last view{" "}
                  {getRelativeTimeString(new Date(deployment.lastPingAt))}
                </small>
              </div>
            )}
            <div className={styles.flexRight}>
              <Tooltip content="Manage Embed">
                <button
                  className={styles.iconButton}
                  onClick={async (e) => {
                    e.stopPropagation();
                    await router.push(
                      `/dashboard/${dashboardSlug}/embeds/${kebabCase(deployment.embedType.toLowerCase())}/${deployment.embedId}/manage`
                    );
                  }}
                >
                  <BsCodeSquare color="var(--blue-text-light)" />
                </button>
              </Tooltip>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
