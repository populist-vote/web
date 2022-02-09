import type { PropsWithChildren, ReactNode } from "react";
import Footer from "../Footer/Footer";
import Nav from "../Nav/Nav";
import styles from "./Layout.module.scss";

export default function Layout({
  mobileNavTitle,
  showNavBackButton,
  children,
}: PropsWithChildren<{
  mobileNavTitle?: string,
  showBackButton?: boolean,
}>) {
  return (
    <div className={styles.app}>
      <Nav mobileNavTitle={mobileNavTitle} showBackButton={showNavBackButton} />
      <main className={styles.content}>{children}</main>
      <Footer />
    </div>
  );
}
