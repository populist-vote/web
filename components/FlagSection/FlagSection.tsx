import React from "react";
import styles from "./FlagSection.module.scss";
import classNames from "classnames";

interface FlagSectionProps {
  title: string;
  children: React.ReactNode;
  color?: "salmon" | "green" | "yellow";
  hideFlagForMobile?: boolean
}

export default function FlagSection(props: FlagSectionProps): JSX.Element {
  const { title, children, color, hideFlagForMobile = false } = props;
  const styleClasses = classNames(styles.container, {
    [styles.hideFlagForMobile as string]: hideFlagForMobile,
    ...!!color ? { [styles[color] as string]: true } : {},
  });
  return (
    <section className={styleClasses}>
      <header className={styles.header}>
        <span className={styles.sectionTitle}>{title}</span>
      </header>
      <div className={styles.content}>{children}</div>
    </section>
  );
}
