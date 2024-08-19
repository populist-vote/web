import { Badge } from "components/Badge/Badge";
import { Box } from "components/Box/Box";
import { ImageWithFallback } from "components/ImageWithFallback/ImageWithFallback";
import { Tooltip } from "components/Tooltip/Tooltip";
import { EnhancedEmbedOriginResult } from "generated";
import Link from "next/link";
import { useRouter } from "next/router";
import clsx from "clsx";
import {
  RiListSettingsFill,
  RiExternalLinkLine,
  RiEyeFill,
} from "react-icons/ri";
import styles from "./DeploymentsList.module.scss";
import { getRelativeTimeString } from "utils/dates";
import { EmbedTypeColorMap } from "components/Dashboard/Dashboard";
import { kebabCase } from "utils/strings";

export function DeploymentsList({
  deployments,
}: {
  deployments: EnhancedEmbedOriginResult[];
}) {
  const router = useRouter();
  const dashboardSlug = router.query.dashboardSlug as string;
  return (
    <div className={styles.deployments}>
      {deployments?.length == 0 && (
        <Box>
          <small className={styles.noResults}>No deployments</small>
        </Box>
      )}

      {deployments?.map((deployment: EnhancedEmbedOriginResult) => (
        <div className={styles.deploymentRow} key={deployment.url}>
          {deployment.name && <h3>{deployment.name}</h3>}
          {deployment.embedType && (
            <Badge
              theme={EmbedTypeColorMap[deployment.embedType]}
              size="small"
              variant="solid"
            >
              {deployment.embedType?.replace("_", " ")}
            </Badge>
          )}

          <div className={styles.flexBetween}>
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
              className={clsx(styles.linkParent, styles.clamp1)}
            >
              {deployment.url}
            </Link>
          </div>
          {deployment.lastPingAt && (
            <div className={styles.flexRight}>
              <RiEyeFill color="var(--salmon)" />
              <small style={{ fontStyle: "italic" }}>
                Last view{" "}
                {getRelativeTimeString(new Date(deployment.lastPingAt))}
              </small>
            </div>
          )}
          <div className={styles.flexRight}>
            <Tooltip content="Visit Page">
              <button
                className={styles.iconButton}
                onClick={() => window.open(deployment.url, "_blank")}
              >
                <RiExternalLinkLine color="var(--blue-text-light)" />
              </button>
            </Tooltip>
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
                <RiListSettingsFill color="var(--blue-text-light)" />
              </button>
            </Tooltip>
          </div>
        </div>
      ))}
    </div>
  );
}
