import clsx from "clsx";
import styles from "./MyBallotEmbed.module.scss";

interface MyBallotEmbedRenderOptions {
  defaultLanguage?: string;
}

export function CandidateGuideEmbed({
  embedId,
  origin,
  renderOptions,
}: {
  embedId: string;
  origin: string;
  renderOptions?: MyBallotEmbedRenderOptions;
}) {
  const { defaultLanguage } = renderOptions || {};

  return (
    <div
      className={clsx(styles.widgetContainer, styles.candidateGuideContainer)}
    ></div>
  );
}
