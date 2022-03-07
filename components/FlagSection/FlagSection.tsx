import React from "react";
import styles from "./FlagSection.module.scss";

interface FlagSectionProps {
  title: string;
  children: React.ReactNode;
  color?: "salmon" | "green" | "yellow";
}

export default function FlagSection(props: FlagSectionProps): JSX.Element {
  const { title, children, color } = props;
  return (
    <section className={`${styles.container} ${color && styles[color]}`}>
      <header className={styles.header}>
        <span className={styles.sectionTitle}>{title}</span>
      </header>
      <div className={styles.content}>{children}</div>
    </section>
  );
}
