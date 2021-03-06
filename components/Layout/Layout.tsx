import type { PropsWithChildren } from "react";
import { Footer, Nav } from "components";
import styles from "./Layout.module.scss";

const defaultNavItems = [
  {
    label: "Ballot",
    href: "/ballot",
  },
  {
    label: "Politicians",
    href: "/politicians",
  },
  {
    label: "Voting guides",
    href: "/voting-guides",
  },
];

function Layout({
  mobileNavTitle,
  showNavBackButton = false,
  showNavLogoOnMobile = true,
  navItems = defaultNavItems,
  hideFooter = false,
  children,
}: PropsWithChildren<{
  mobileNavTitle?: string;
  showNavBackButton?: boolean;
  showNavLogoOnMobile?: boolean;
  navItems?: {
    label: string;
    href: string;
  }[];
  hideFooter?: boolean;
}>) {
  return (
    <div className={styles.app}>
      <aside>
        <Nav
          mobileNavTitle={mobileNavTitle}
          showBackButton={showNavBackButton}
          showLogoOnMobile={showNavLogoOnMobile}
          navItems={navItems}
        />
      </aside>
      <main className={styles.content}>{children}</main>
      {!hideFooter && <Footer />}
    </div>
  );
}

export { Layout };
