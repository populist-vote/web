import clsx from "clsx";
import { CSSProperties, PropsWithChildren } from "react";
import styles from "./ColoredSection.module.scss";

function ColoredSection(
  props: PropsWithChildren<{
    color: string;
  }>
) {
  const styleVars: CSSProperties & {
    "--color-accent": string;
  } = {
    "--color-accent": props.color,
  };

  return (
    <section
      className={clsx(styles.center, styles.coloredSection)}
      style={styleVars}
    >
      {props.children}
    </section>
  );
}

export { ColoredSection };
