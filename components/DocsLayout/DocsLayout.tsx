/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/anchor-is-valid */

import React, { useEffect, useState } from "react";
import styles from "./DocsLayout.module.scss";
import { Avatar, Button, LogoText } from "components";
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
  hideAside = false,
}: {
  children: React.ReactNode;
  currentPage: NavigationSectionKey;
  hideAside?: boolean;
}) {
  const router = useRouter();
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

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
    // If you have any body scroll locking, handle it here
    document.body.style.overflow = !isDrawerOpen ? "hidden" : "";
  };

  const styleVars: React.CSSProperties & {
    "--mainContentMarginLeft": string;
  } = {
    "--mainContentMarginLeft": hideAside ? "0" : "16rem",
  };

  // Update the BottomDrawer component inside your DocsLayout:
  const BottomDrawer = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [isContentVisible, setIsContentVisible] = useState(false);

    // Handle drawer state changes
    useEffect(() => {
      if (isDrawerOpen) {
        // First make the drawer visible
        setIsVisible(true);
        // Then trigger the animation after a brief delay
        const timer = setTimeout(() => {
          setIsContentVisible(true);
        }, 50);
        return () => clearTimeout(timer);
      } else {
        // Hide content first
        setIsContentVisible(false);
        // Then hide drawer after animation completes
        const timer = setTimeout(() => {
          setIsVisible(false);
        }, 500); // Match this with your CSS transition duration
        return () => clearTimeout(timer);
      }
    }, []);

    if (!isVisible) return null;

    return (
      <>
        <div
          className={`${styles.drawerOverlay} ${isContentVisible ? styles.open : ""}`}
          onClick={() => setIsDrawerOpen(false)}
          onKeyDown={() => setIsDrawerOpen(false)}
        />
        <div
          className={`${styles.bottomDrawer} ${isContentVisible ? styles.open : ""}`}
        >
          <div
            className={styles.drawerHandle}
            onClick={() => setIsDrawerOpen(false)}
          />
          <div className={styles.drawerContent}>
            <div className={styles.drawerSearch}>
              <DocSearch />
            </div>

            <nav className={styles.drawerNav}>
              <div className={styles.drawerSection}>
                <h3>Navigation</h3>
                <ul className={styles.navList}>
                  {tabs.map((tab) => (
                    <li key={tab.id} data-selected={activeTab === tab.id}>
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

              {currentNav?.sections.map(
                (section: NavigationSection, index: number) => (
                  <div key={index} className={styles.drawerSection}>
                    <h3>{section.title}</h3>
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
            </nav>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <button onClick={toggleDrawer} className={styles.menuButton}>
            <BiMenu className={styles.menuIcon} />
          </button>
          <div className={styles.headerLeft}>
            <Link href="/docs" style={{ textDecoration: "none" }}>
              <div className={styles.logoSection}>
                <LogoText />
                <span className={styles.logoText}>Docs</span>
              </div>
            </Link>
          </div>

          <div className={styles.searchContainer}>
            <DocSearch />
          </div>

          <div className={styles.headerRight}>
            {!user && (
              <Button label="Get Started" href="/register" size="small" />
            )}
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

      <div className={styles.mainLayout} style={styleVars}>
        {!hideAside && (
          <aside className={styles.sidebar}>
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

        <BottomDrawer />
      </div>
    </div>
  );
}

export default DocsLayout;
