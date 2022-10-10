import React from "react";
import styles from "./FlagSection.module.scss";
import classNames from "classnames";

export type FlagColor = "salmon" | "green" | "yellow" | "aqua" | "violet";

interface FlagSectionProps {
  title: string;
  children: React.ReactNode;
  color?: FlagColor;
  hideFlagForMobile?: boolean;
  [x: string]: unknown;
}

function FlagSection(props: FlagSectionProps): JSX.Element {
  const { title, children, color, hideFlagForMobile = false } = props;
  const styleClasses = classNames(styles.container, {
    [styles.hideFlagForMobile as string]: hideFlagForMobile,
    ...(!!color ? { [styles[color] as string]: true } : {}),
  });
  return (
    <section className={styleClasses} {...props}>
      <header className={styles.header}>
        <span className={styles.sectionTitle}>{title}</span>
      </header>
      <div className={styles.content}>{children}</div>
    </section>
  );
}

export { FlagSection };
