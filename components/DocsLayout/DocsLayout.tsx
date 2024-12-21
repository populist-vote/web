import React, { useState, useEffect } from "react";
import styles from "./DocsLayout.module.scss";
import { FaMarsAndVenus } from "react-icons/fa6";
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

export function DocsLayout({
  children,
  currentPage,
}: {
  children: React.ReactNode;
  currentPage: NavigationSectionKey;
}) {
  const router = useRouter();
  const [isNavOpen, setIsNavOpen] = React.useState(true);
  const { user } = useAuth();
  const [_, setActiveSection] = useState<string>("");

  const [activeTab, setActiveTab] = useState<NavigationSectionKey>(
    currentPage || "content"
  );

  const tabs = navigationConfig.tabs;
  const currentNav = navigationConfig[activeTab];

  // Setup intersection observer for sections
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.1) {
            const sectionId = entry.target.id;
            console.log("IntersectionObserver section visible:", sectionId); // Debugging log
            setActiveSection(sectionId);

            // Update the URL only if the section ID changes
            if (window.location.hash !== `#${sectionId}`) {
              window.history.replaceState(null, "", `#${sectionId}`);
            }
          }
        });
      },
      {
        threshold: [0, 0.1, 0.5, 1.0],
        rootMargin: "-20% 0px -70% 0px",
      }
    );

    const sections = document.querySelectorAll("[data-section-id]");
    sections.forEach((section) => observer.observe(section));

    // Clean up observer
    return () => {
      sections.forEach((section) => observer.unobserve(section));
      observer.disconnect();
    };
  }, []);

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
    const currentHash = window.location.hash.slice(1);
    const itemHash = href.split("#")[1];
    return currentHash === itemHash;
  };

  // Scroll event handling for updating active section and hash
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll("[data-section-id]");
      let found = false;

      for (let i = 0; i < sections.length; i++) {
        const section = sections[i];
        const rect = section?.getBoundingClientRect();

        if (rect && rect.top >= 0 && rect.top <= window.innerHeight * 0.5) {
          if (!found) {
            setActiveSection(section?.id as string);
            // Update the URL only if the section ID changes
            if (window.location.hash !== `#${section?.id}`) {
              window.history.replaceState(null, "", `#${section?.id}`);
            }
            found = true;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Clean up scroll listener
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerLeft}>
            <button
              onClick={() => setIsNavOpen(!isNavOpen)}
              className={styles.menuButton}
            >
              <FaMarsAndVenus className={styles.menuIcon} />
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

      <div className={styles.mainLayout}>
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

        <main className={styles.mainContent}>
          <div className={styles.contentWrapper}>{children}</div>
        </main>
      </div>
    </div>
  );
}

export default DocsLayout;
