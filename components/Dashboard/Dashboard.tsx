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
import * as Tooltip from "@radix-ui/react-tooltip";

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
                  href={`/dashboard/${query.slug}/embeds/${embedType
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
  const { query } = useRouter();
  const slug = query.slug as string;

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
      <div className={styles.tiles}>
        {deployments?.length == 0 && (
          <small className={styles.noResults}>No deployments</small>
        )}

        {deployments?.map((deployment: EnhancedEmbedOriginResult) => (
          <Link
            href={deployment.url}
            key={`${deployment.embedId + deployment.url}`}
            target="_blank"
            rel="noreferrer"
            className={styles.linkParent}
          >
            <Box key={deployment.url} isLink>
              <div
                className={styles.flexBaseline}
                style={{ marginBottom: "1.25rem" }}
              >
                <Badge
                  theme={EmbedTypeColorMap[deployment.embedType]}
                  size="small"
                  variant="solid"
                >
                  {deployment.embedType.replace("_", " ")}
                </Badge>
                {deployment.lastPingAt && (
                  <div className={styles.flexRight}>
                    <BsEyeglasses />
                    <small>
                      Last view{" "}
                      {getRelativeTimeString(new Date(deployment.lastPingAt))}
                    </small>
                  </div>
                )}
              </div>
              <div className={styles.flexBaseline}>
                <h3>{deployment.name}</h3>
                <Tooltip.Provider delayDuration={300}>
                  <Tooltip.Root>
                    <Tooltip.Trigger asChild>
                      <Link
                        href={`/dashboard/${slug}/embeds/${deployment.embedType}/${deployment.embedId}/manage`}
                      >
                        <BsCodeSquare />
                      </Link>
                    </Tooltip.Trigger>
                    <Tooltip.Portal>
                      <Tooltip.Content
                        className={styles.TooltipContent}
                        sideOffset={5}
                      >
                        Manage embed
                        <Tooltip.Arrow className={styles.TooltipArrow} />
                      </Tooltip.Content>
                    </Tooltip.Portal>
                  </Tooltip.Root>
                </Tooltip.Provider>
              </div>
              <div
                style={{
                  display: "flex",
                  gap: "1rem",
                  alignItems: "center",
                  marginTop: "1rem",
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
                <h5>{deployment.url}</h5>
              </div>
            </Box>
          </Link>
        ))}
      </div>
    </section>
  );
}
