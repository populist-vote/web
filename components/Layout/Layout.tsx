import type { PropsWithChildren } from "react";
import { Footer, Nav, NavItem } from "components";
import styles from "./Layout.module.scss";
import { useTranslation } from "next-i18next";

function Layout({
  mobileNavTitle,
  showNavLogoOnMobile = true,
  hasVotingGuide = false,
  navItems,
  hideFooter = false,
  children,
}: PropsWithChildren<{
  mobileNavTitle?: string;
  showNavLogoOnMobile?: boolean;
  hasVotingGuide?: boolean;
  navItems?: NavItem[];
  hideFooter?: boolean;
}>) {
  const { t } = useTranslation("common");
  const defaultNavItems = [
    {
      label: t("elections"),
      href: "/ballot",
      childPaths: ["/voting-guides"],
    },
    {
      label: t("politicians"),
      href: "/politicians",
    },
    {
      label: t("legislation"),
      href: "/bills",
    },
  ] as NavItem[];

  return (
    <div className={styles.app}>
      <Nav
        mobileNavTitle={mobileNavTitle}
        showLogoOnMobile={showNavLogoOnMobile}
        navItems={navItems || defaultNavItems}
        hasVotingGuide={hasVotingGuide}
      />
      <main className={styles.content}>{children}</main>
      {!hideFooter && <Footer />}
    </div>
  );
}

export { Layout };
