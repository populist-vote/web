import type { PropsWithChildren } from "react";
import Footer from "components/Footer/Footer";
import Nav from "components/Nav/Nav";
import styles from "./Layout.module.scss";

export default function Layout({
  mobileNavTitle,
  showNavBackButton = false,
  showNavLogoOnMobile = true,
  children,
}: PropsWithChildren<{
  mobileNavTitle?: string;
  showNavBackButton?: boolean;
  showNavLogoOnMobile?: boolean;
}>) {
  return (
    <div className={styles.app}>
      <aside>
        <Nav
          mobileNavTitle={mobileNavTitle}
          showBackButton={showNavBackButton}
          showLogoOnMobile={showNavLogoOnMobile}
        />
      </aside>
      <main className={styles.content}>{children}</main>
      <Footer />
    </div>
  );
}
