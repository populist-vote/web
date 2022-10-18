import type { PropsWithChildren } from "react";
import { Footer, Nav } from "components";
import styles from "./Layout.module.scss";

const defaultNavItems = [
  {
    label: "My Ballot",
    href: "/ballot",
  },
  {
    label: "Voting Guides",
    href: "/voting-guides",
  },
  {
    label: "Politicians",
    href: "/politicians",
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
      <Nav
        mobileNavTitle={mobileNavTitle}
        showBackButton={showNavBackButton}
        showLogoOnMobile={showNavLogoOnMobile}
        navItems={navItems}
      />
      <main className={styles.content}>{children}</main>
      {!hideFooter && <Footer />}
    </div>
  );
}

export { Layout };
