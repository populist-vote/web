import { Badge } from "components/Badge/Badge";
import { Box } from "components/Box/Box";
import styles from "./Dashboard.module.scss";
import { EmbedType, useEmbedsByOrganizationQuery } from "generated";
import Link from "next/link";
import { useRouter } from "next/router";

export function Dashboard({ organizationId }: { organizationId: string }) {
  const { query } = useRouter();
  const { data } = useEmbedsByOrganizationQuery({
    id: organizationId,
  });
  const embeds = data?.embedsByOrganization ?? [];
  const legislationEmbeds = embeds.filter(
    (embed) => embed.embedType === EmbedType.Legislation
  );
  const legislationEmbedDeployments = legislationEmbeds.reduce(
    (a, l) => a + (l?.origins?.length || 0),
    0
  );
  const politicianEmbeds = embeds.filter(
    (embed) => embed.embedType === EmbedType.Politician
  );
  const politicianEmbedDeployments = politicianEmbeds.reduce(
    (a, p) => a + (p?.origins?.length || 0),
    0
  );

  const questionEmbeds = embeds.filter(
    (embed) => embed.embedType === EmbedType.Question
  );
  const questionSubmissionLength = questionEmbeds.reduce(
    (a, q) => a + (q.question?.submissions?.length || 0),
    0
  );
  const questionEmbedDeployments = questionEmbeds.reduce(
    (a, q) => a + (q?.origins?.length || 0),
    0
  );
  const pollEmbeds = embeds.filter(
    (embed) => embed.embedType === EmbedType.Poll
  );
  const pollSubmissionLength = pollEmbeds.reduce(
    (a, p) => a + (p.poll?.submissions?.length || 0),
    0
  );
  const pollEmbedDeployments = pollEmbeds.reduce(
    (a, p) => a + (p?.origins?.length || 0),
    0
  );

  return (
    <div className={styles.container}>
      <h2 style={{ textAlign: "center" }}>Activity</h2>
      <div className={styles.tiles}>
        <Box>
          <div className={styles.tile}>
            <Link href={`/dashboard/${query.slug}/embeds/legislation`} passHref>
              <Badge theme="yellow" size="large" variant="solid" clickable>
                Legislation
              </Badge>
            </Link>
            <div>
              <div className={styles.dotSpread}>
                <span>Embeds</span>
                <span className={styles.dots} />
                <span style={{ color: "var(--yellow)" }}>
                  {legislationEmbeds.length}
                </span>
              </div>
              <div className={styles.dotSpread}>
                <span>Deployments</span>
                <span className={styles.dots} />
                <span style={{ color: "var(--yellow)" }}>
                  {legislationEmbedDeployments}
                </span>
              </div>
            </div>
          </div>
        </Box>
        <Box>
          <div className={styles.tile}>
            <Link href={`/dashboard/${query.slug}/embeds/politician`} passHref>
              <Badge theme="aqua" size="large" variant="solid" clickable>
                Politicians
              </Badge>
            </Link>
            <div>
              <div className={styles.dotSpread}>
                <span>Embeds</span>
                <span className={styles.dots} />
                <span style={{ color: "var(--aqua)" }}>
                  {politicianEmbeds.length}
                </span>
              </div>
              <div className={styles.dotSpread}>
                <span>Deployments</span>
                <span className={styles.dots} />
                <span style={{ color: "var(--aqua)" }}>
                  {politicianEmbedDeployments}
                </span>
              </div>
            </div>
          </div>
        </Box>
        <Box>
          <div className={styles.tile}>
            <Link href={`/dashboard/${query.slug}/embeds/question`} passHref>
              <Badge theme="orange" size="large" variant="solid" clickable>
                Questions
              </Badge>
            </Link>
            <div>
              <h1>{questionSubmissionLength}</h1>
              <h4 style={{ color: "var(--orange)" }}>Submissions</h4>
            </div>
            <div>
              <div className={styles.dotSpread}>
                <span>Embeds</span>
                <span className={styles.dots} />
                <span style={{ color: "var(--orange)" }}>
                  {questionEmbeds.length}
                </span>
              </div>
              <div className={styles.dotSpread}>
                <span>Deployments</span>
                <span className={styles.dots} />
                <span style={{ color: "var(--orange)" }}>
                  {questionEmbedDeployments}
                </span>
              </div>
            </div>
          </div>
        </Box>
        <Box>
          <div className={styles.tile}>
            <Link href={`/dashboard/${query.slug}/embeds/poll`} passHref>
              <Badge theme="violet" size="large" variant="solid" clickable>
                Polls
              </Badge>
            </Link>
            <div>
              <h1>{pollSubmissionLength}</h1>
              <h4 style={{ color: "var(--violet)" }}>Submissions</h4>
            </div>
            <div>
              <div className={styles.dotSpread}>
                <span>Embeds</span>
                <span className={styles.dots} />
                <span style={{ color: "var(--violet)" }}>
                  {pollEmbeds.length}
                </span>
              </div>
              <div className={styles.dotSpread}>
                <span>Deployments</span>
                <span className={styles.dots} />
                <span style={{ color: "var(--violet)" }}>
                  {pollEmbedDeployments}
                </span>
              </div>
            </div>
          </div>
        </Box>
      </div>

      <p
        style={{ fontSize: "1.1em", alignSelf: "flex-end", marginTop: "5rem" }}
      >
        If you have any questions, please reach out to us at{" "}
        <a href="mailto:info@populist.us">info@populist.us</a>
      </p>
    </div>
  );
}
