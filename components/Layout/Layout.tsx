import type { PropsWithChildren } from "react";
import { Footer, Nav } from "components";
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
  navItems?: {
    label: string;
    href: string;
  }[];
  hideFooter?: boolean;
}>) {
  const { t } = useTranslation("common");
  const defaultNavItems = [
    {
      label: t("elections"),
      href: "/ballot",
    },
    {
      label: t("politicians"),
      href: "/politicians",
    },
    {
      label: t("legislation"),
      href: "/bills",
    },
  ];
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
