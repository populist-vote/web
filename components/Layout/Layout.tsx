import type { PropsWithChildren } from "react";
import { Footer, Nav } from "components";
import styles from "./Layout.module.scss";

function Layout({
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

export { Layout };
