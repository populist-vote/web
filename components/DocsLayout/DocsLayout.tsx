import React, { useState } from "react";
import styles from "./DocsLayout.module.scss";
import { AuthButtons, Avatar, LogoText } from "components";
import {
  navigationConfig,
  NavigationSection,
  NavigationSectionKey,
} from "../../utils/navigationConfig";
import { useRouter } from "next/router";
import { useAuth } from "hooks/useAuth";
import Link from "next/link";
import { PERSON_FALLBACK_IMAGE_400_URL } from "utils/constants";
import DocSearch from "components/DocSearch/DocSearch";
import { BiMenu } from "react-icons/bi";
import { useHashRoutes } from "hooks/useHashRoute";

export function DocsLayout({
  children,
  currentPage,
  hideAside,
}: {
  children: React.ReactNode;
  currentPage: NavigationSectionKey;
  hideAside?: boolean;
}) {
  const router = useRouter();
  const [isNavOpen, setIsNavOpen] = React.useState(true);
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<NavigationSectionKey>(
    currentPage || "content"
  );

  const tabs = navigationConfig.tabs;
  const currentNav = navigationConfig[activeTab];

  useHashRoutes();

  // Tab change handler
  const handleTabChange = (tabId: NavigationSectionKey) => {
    setActiveTab(tabId);
    const firstItem = navigationConfig[tabId]?.sections[0]?.items[0];
    if (firstItem?.href) {
      void router.push(firstItem.href);
    }
  };

  // Update nav item selection based on hash
  const isNavItemSelected = (href: string): boolean => {
    if (typeof window === "undefined") return false;

    const currentPath = window.location.pathname;
    const currentHash = window.location.hash;
    const [path, hash] = href.split("#");
    return currentPath === path && currentHash === (hash ? `#${hash}` : "");
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerLeft}>
            <button
              onClick={() => setIsNavOpen(!isNavOpen)}
              className={styles.menuButton}
            >
              <BiMenu className={styles.menuIcon} />
            </button>
            <div className={styles.logoSection}>
              <LogoText />
              <span className={styles.logoText}>Docs</span>
            </div>
          </div>

          <div className={styles.searchContainer}>
            <DocSearch />
          </div>

          <div className={styles.headerRight}>
            {!user && <AuthButtons />}
            {user && (
              <div className={styles.linkSection}>
                <Link href="/settings/profile" passHref>
                  <div style={{ cursor: "pointer" }}>
                    <Avatar
                      src={
                        user?.userProfile.profilePictureUrl ||
                        PERSON_FALLBACK_IMAGE_400_URL
                      }
                      alt="profile picture"
                      size={35}
                    />
                  </div>
                </Link>
              </div>
            )}
          </div>
        </div>

        <nav className={styles.tabNav}>
          <div className={styles.tabContainer}>
            <ul>
              {tabs.map((tab) => (
                <li
                  key={tab.id}
                  data-selected={activeTab === tab.id}
                  data-color={tab.color}
                >
                  {/* eslint-disable jsx-a11y/anchor-is-valid  */}
                  {/* eslint-disable jsx-a11y/no-static-element-interactions */}
                  <a
                    onClick={(e) => {
                      e.preventDefault();
                      handleTabChange(tab.id as NavigationSectionKey);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleTabChange(tab.id as NavigationSectionKey);
                      }
                    }}
                    className={styles.tabButton}
                  >
                    {tab.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </header>

      <div
        className={styles.mainLayout}
        style={{ marginLeft: hideAside ? 0 : "16rem" }}
      >
        {!hideAside && (
          <aside
            className={`${styles.sidebar} ${isNavOpen ? styles.sidebarOpen : styles.sidebarClosed}`}
          >
            <nav className={styles.nav}>
              <div className={styles.navSection}>
                {currentNav?.sections.map(
                  (section: NavigationSection, index: number) => (
                    <div key={index} className={styles.navGroup}>
                      <h3 className={styles.navGroupTitle}>{section.title}</h3>
                      <ul className={styles.navList}>
                        {section.items.map((item, itemIndex) => (
                          <li key={itemIndex}>
                            <a
                              href={item.href}
                              className={styles.navLink}
                              data-selected={isNavItemSelected(item.href)}
                            >
                              {item.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )
                )}
              </div>
            </nav>
          </aside>
        )}

        <main className={styles.mainContent}>
          <div className={styles.contentWrapper}>{children}</div>
        </main>
      </div>
    </div>
  );
}

export default DocsLayout;
