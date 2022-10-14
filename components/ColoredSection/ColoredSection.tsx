import classNames from "classnames";
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
      className={classNames(styles.center, styles.coloredSection)}
      style={styleVars}
    >
      {props.children}
    </section>
  );
}

export { ColoredSection };
