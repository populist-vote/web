import type { PropsWithChildren, ReactNode } from "react";
import Footer from "components/Footer/Footer";
import Nav from "components/Nav/Nav";
import styles from "./Layout.module.scss";

export default function Layout({
  mobileNavTitle,
  showNavBackButton,
  children,
}: PropsWithChildren<{
  mobileNavTitle?: string,
  showNavBackButton?: boolean,
}>) {
  return (
    <div className={styles.app}>
      <Nav mobileNavTitle={mobileNavTitle} showBackButton={showNavBackButton} />
      <main className={styles.content}>{children}</main>
      <Footer />
    </div>
  );
}
