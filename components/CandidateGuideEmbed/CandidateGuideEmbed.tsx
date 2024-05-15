import { useEmbedResizer } from "hooks/useEmbedResizer";
import styles from "./CandidateGuideEmbed.module.scss";
import { WidgetFooter } from "components/WidgetFooter/WidgetFooter";
import Divider from "components/Divider/Divider";
import { Badge } from "components/Badge/Badge";

export function CandidateGuideEmbed({
  embedId,
  origin,
}: {
  embedId: string;
  origin: string;
}) {
  useEmbedResizer({ origin, embedId });
  return (
    <div className={styles.widgetContainer}>
      <header className={styles.header}>
        <strong>Candidate Guide</strong>
        <strong>2024 - General Election</strong>
      </header>
      <main>
        <div className={styles.title}>
          <div className={styles.flexEvenly}>
            <h2>Governor</h2>
            <Divider vertical color="var(--grey-dark)" />
            <h2>Minnesota</h2>
          </div>
          <div>
            <Badge theme="grey" label="2024" />
          </div>
        </div>
      </main>
      <WidgetFooter />
    </div>
  );
}
