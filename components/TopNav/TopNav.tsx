import { ReactNode } from "react";
import styles from "./TopNav.module.scss";

function TopNav({ children }: { children?: ReactNode }) {
  return <nav className={styles.container}>{children}</nav>;
}

export { TopNav };
