import { Badge } from "components/Badge/Badge";
import Link from "next/link";
import { useRouter } from "next/router";
import styles from "./EmbedPageTabs.module.scss";
import { EmbedType } from "generated";

export function EmbedPageTabs({ embedType }: { embedType: EmbedType }) {
  const router = useRouter();
  const { slug, id } = router.query;

  return (
    <div className={styles.container}>
      <Link
        href={`/dashboard/${slug}/embeds/${embedType.toLowerCase()}/${id}/manage`}
      >
        <Badge
          theme="blue"
          clickable
          label="Manage"
          selected={router.asPath.includes("manage")}
        />
      </Link>
      <Link
        href={`/dashboard/${slug}/embeds/${embedType.toLowerCase()}/${id}/submissions`}
      >
        <Badge
          theme="blue"
          clickable
          label="Submissions"
          selected={router.asPath.includes("submissions")}
        />
      </Link>
    </div>
  );
}
