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
  const { t } = useTranslation("actions");
  const defaultNavItems = [
    {
      label: t("my-ballot"),
      href: "/ballot",
    },
    {
      label: t("voting-guides"),
      href: "/voting-guides",
    },
    {
      label: t("politicians"),
      href: "/politicians",
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
