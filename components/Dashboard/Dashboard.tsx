import { Badge } from "components/Badge/Badge";
import { Box } from "components/Box/Box";
import styles from "./Dashboard.module.scss";
import {
  EmbedType,
  EmbedsCountResult,
  useEmbedsActivityQuery,
  useEmbedsDeploymentsQuery,
  useOrganizationBySlugQuery,
  useTotalCandidateGuideSubmissionsQuery,
} from "generated";
import Link from "next/link";
import { useRouter } from "next/router";
import { LoaderFlag } from "components/LoaderFlag/LoaderFlag";
import { Theme } from "hooks/useTheme";

import { DeploymentsList } from "components/DeploymentsList/DeploymentsList";
import Divider from "components/Divider/Divider";
import { OrganizationAvatar } from "components/Avatar/Avatar";
import { ORGANIZATION_FALLBACK_IMAGE_URL } from "utils/constants";
import { useAuth } from "hooks/useAuth";

export const EmbedTypeColorMap: Record<EmbedType, Theme> = {
  LEGISLATION: "yellow",
  LEGISLATION_TRACKER: "green",
  POLITICIAN: "aqua",
  RACE: "blue",
  QUESTION: "orange",
  POLL: "violet",
  CANDIDATE_GUIDE: "aqua",
  MY_BALLOT: "yellow",
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
  const { user } = useAuth();
  const displayName = user?.userProfile.firstName
    ? `${user.userProfile.firstName} ${user.userProfile.lastName}`
    : user?.email;
  const { query } = useRouter();
  const dashboardSlug = query.dashboardSlug as string;
  const hasActivity = activity?.length > 0;
  const { data: organizationData } = useOrganizationBySlugQuery(
    {
      slug: dashboardSlug as string,
    },
    {
      enabled: !!dashboardSlug,
    }
  );

  const organization = organizationData?.organizationBySlug;

  if (!hasActivity)
    return (
      <div className={styles.centered} style={{ height: "100%" }}>
        <Box>
          <div className={styles.flexLeft}>
            <OrganizationAvatar
              src={
                organization?.assets.thumbnailImage160 ||
                ORGANIZATION_FALLBACK_IMAGE_URL
              }
              alt={organization?.name as string}
              size={100}
            />
            <div className={styles.flexColumn}>
              <h2 style={{ margin: 0 }}>{organization?.name}</h2>
              <h3>{displayName}</h3>
            </div>
          </div>
          <Divider />
          <div className={styles.flexBetween}>
            <h3>
              Welcome to your dashboard! Click on "New Embed" to get started.
            </h3>
            <span style={{ fontSize: "2em" }}>👆</span>
          </div>
          <Divider />
          <p style={{ fontSize: "1.1em", color: "var(--blue-text-light)" }}>
            Populist allows organizations to create interactive content that
            fosters civic engagement and community participation. With Populist,
            you can easily build and embed tools like polls, questions, race and
            candidate information, and much more directly into your website,
            articles, or newsletters. We make it easy to drive civic involvement
            and keep your readers or followers engaged with the issues that
            matter most to them. Questions? Reach out to us at{" "}
            <a href="mailto:info@populist.us">info@populist.us</a>.
          </p>
        </Box>
      </div>
    );
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

  if (!deployments || deployments.length === 0) return null;

  return (
    <section>
      <h2 style={{ textAlign: "center" }}>Recent Views</h2>
      <DeploymentsList deployments={deployments || []} />
    </section>
  );
}
