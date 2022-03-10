import type { PropsWithChildren, ReactNode } from "react";
import Footer from "components/Footer/Footer";
import styles from "./BasicLayout.module.scss";

export default function BasicLayout({ children }: { children: ReactNode }) {
  return (
    <div className={styles.container}>
      <main className={styles.content}>{children}</main>
      <Footer />
    </div>
  );
}
