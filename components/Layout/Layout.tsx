import type { PropsWithChildren, ReactNode } from "react";
import Footer from "../Footer/Footer";
import Nav from "../Nav/Nav";
import styles from "./Layout.module.scss";

export default function Layout({
  mobileNavTitle,
  children,
}: PropsWithChildren<{ mobileNavTitle?: string }>) {
  return (
    <div className={styles.app}>
      <Nav mobileNavTitle={mobileNavTitle} />
      <main className={styles.content}>{children}</main>
      <Footer />
    </div>
  );
}
