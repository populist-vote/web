import React from "react";
import styles from "./FlagSection.module.scss";
import clsx from "clsx";

export type FlagColor = "salmon" | "green" | "yellow" | "aqua" | "violet";

interface FlagSectionProps {
  label: string;
  children: React.ReactNode;
  color?: FlagColor;
  hideFlagForMobile?: boolean;
  style?: React.CSSProperties;
}

function FlagSection(props: FlagSectionProps): JSX.Element {
  const { label, children, color, hideFlagForMobile = false, style } = props;
  const styleClasses = clsx(styles.container, {
    [styles.hideFlagForMobile as string]: hideFlagForMobile,
    ...(!!color ? { [styles[color] as string]: true } : {}),
  });

  return (
    <section style={style} className={styleClasses}>
      <header className={styles.header}>
        <span className={styles.sectionTitle}>{label}</span>
      </header>
      <div className={styles.content}>{children}</div>
    </section>
  );
}

export { FlagSection };
