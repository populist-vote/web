import clsx from "clsx";
import styles from "./ConversationEmbed.module.scss";

interface ConversationEmbedRenderOptions {
  _tbd: unknown;
}

export function CandidateGuideEmbed({
  embedId,
  conversationId,
  origin,
  renderOptions,
}: {
  embedId: string;
  conversationId: string;
  origin: string;
  renderOptions: ConversationEmbedRenderOptions;
}) {
  return (
    <div
      className={clsx(
        styles.widgetContainer,
        styles.conversationEmbedContainer
      )}
    >
        
    </div>
  );
}
