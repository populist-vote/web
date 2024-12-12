import type { PropsWithChildren } from "react";
import { Footer, Nav, NavItem } from "components";
import styles from "./Layout.module.scss";
import { useTranslation } from "next-i18next";

function Layout({
  hideNav = false,
  mobileNavTitle,
  showNavLogoOnMobile = true,
  hasVotingGuide = false,
  navItems,
  hideFooter = false,
  children,
}: PropsWithChildren<{
  hideNav?: boolean;
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

  const styleVars = {
    "--app-nav-width": hideNav ? "0" : "var(--nav-width)",
  } as React.CSSProperties & {
    "--app-nav-width": string;
  };

  return (
    <div className={styles.app} style={styleVars}>
      {!hideNav && (
        <Nav
          mobileNavTitle={mobileNavTitle}
          showLogoOnMobile={showNavLogoOnMobile}
          navItems={navItems || defaultNavItems}
          hasVotingGuide={hasVotingGuide}
        />
      )}
      <main className={styles.content}>{children}</main>
      {!hideFooter && <Footer />}
    </div>
  );
}

export { Layout };
