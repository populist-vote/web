import Link from "next/link";
import { useRouter } from "next/router";
import { FaHome, FaQuestionCircle } from "react-icons/fa";
import { useState } from "react";
import { useScrollPosition } from "hooks/useScrollPosition";
import { useAuth } from "hooks/useAuth";
import styles from "./Nav.module.scss";
import {
  ORGANIZATION_FALLBACK_IMAGE_URL,
  PERSON_FALLBACK_IMAGE_URL,
} from "utils/constants";
import { useMediaQuery } from "hooks/useMediaQuery";
import { Avatar, Logo, LogoBeta, Button } from "components";
import clsx from "clsx";
import { useTranslation } from "next-i18next";
import {
  useOrganizationByIdQuery,
  AuthTokenResult,
  OrganizationResult,
} from "generated";
import useDeviceInfo from "hooks/useDeviceInfo";

export interface NavItem {
  label: string;
  href: string;
  childPaths?: string[];
}

function Nav({
  mobileNavTitle,
  showLogoOnMobile,
  navItems,
}: {
  mobileNavTitle?: string;
  showLogoOnMobile: boolean;
  simpleHeaderOnMobile?: boolean;
  hasVotingGuide?: boolean;
  navItems: NavItem[];
}) {
  const [sticky, setSticky] = useState<boolean>(true);
  const { user } = useAuth();
  const isSmallScreen = useMediaQuery("(max-width: 768px)");

  useScrollPosition(
    ({
      prevPos,
      currPos,
    }: {
      prevPos: { y: number };
      currPos: { y: number };
    }) => {
      if (!isSmallScreen) return;
      // hack because safari thinks its cool to have a bouncy effect and allow scroll position < 0
      let prevPosY = prevPos.y;
      if (prevPosY > 0) {
        prevPosY = 0;
      }
      const isShow = currPos.y >= prevPosY;
      if (isShow !== sticky) setSticky(isShow);
    },
    [sticky]
  );

  const navStyles = clsx(styles.nav, {
    [styles.sticky as string]: sticky,
  });

  return (
    <nav className={navStyles}>
      <MobileNav {...{ mobileNavTitle, showLogoOnMobile, user }} />
      <DesktopNav {...{ navItems, user }} />
    </nav>
  );
}

function MobileNav({
  mobileNavTitle,
  showLogoOnMobile,
  user,
}: {
  mobileNavTitle?: string;
  showLogoOnMobile: boolean;
  user: AuthTokenResult;
}) {
  return (
    <div className={styles.mobileNav}>
      <div className={styles.homeButton}>
        <Link href="/home" passHref>
          <div>
            <FaHome size={"1.7rem"} color="var(--blue)" />
          </div>
        </Link>
      </div>

      <div className={styles.logoContainer}>
        {showLogoOnMobile ? (
          <>
            <div className={styles.logoSizer}>
              <LogoBeta />
            </div>
            <span className={styles.subTitle}>{mobileNavTitle}</span>
          </>
        ) : (
          <>
            <span className={styles.subTitleNoLogo}>{mobileNavTitle}</span>
          </>
        )}
      </div>

      {user && (
        <div className={styles.avatar}>
          <Link href="/settings/profile" passHref>
            <div style={{ width: "35px" }}>
              <Avatar
                src={
                  user.userProfile.profilePictureUrl ||
                  PERSON_FALLBACK_IMAGE_URL
                }
                alt="profile picture"
                size={35}
              />
            </div>
          </Link>
        </div>
      )}
    </div>
  );
}

function DesktopNav({
  user,
  navItems,
}: {
  user: AuthTokenResult;
  navItems: NavItem[];
}) {
  const { t } = useTranslation(["auth", "common"]);
  const { asPath, pathname } = useRouter();
  const { data } = useOrganizationByIdQuery(
    {
      id: user?.organizationId || "",
    },
    {
      enabled: !!user?.organizationId,
    }
  );

  const organization = data?.organizationById;
  return (
    <div className={styles.navContent}>
      <div className={styles.items}>
        <ul>
          <li
            className={clsx(
              styles.navItem,
              styles.logoNavItem,
              pathname.includes("/home") && styles.active
            )}
          >
            <Link href="/home" passHref>
              <div className={styles.logoContainer}>
                <Logo height={100} />
              </div>
            </Link>
          </li>
          {navItems.map(({ label, href, childPaths }) => {
            const isNavItemActive =
              pathname.includes(href) ||
              (childPaths && childPaths.find((p) => pathname.includes(p)));

            return (
              <li
                className={`${styles.navItem} ${
                  isNavItemActive && styles.active
                }`}
                key={href}
              >
                <Link href={href}>{label}</Link>
              </li>
            );
          })}
        </ul>
        <div className={styles.navFooter}>
          {user ? (
            <div>
              {organization && (
                <li
                  className={clsx(styles.navItem, {
                    [styles.active as string]: pathname.includes("/dashboard"),
                  })}
                >
                  <DashboardLink
                    organization={organization as OrganizationResult}
                  />
                </li>
              )}
              <div className={styles.flexColumn}>
                <Link href="/settings/profile" passHref>
                  <div className={styles.avatar}>
                    <Avatar
                      src={
                        user?.userProfile.profilePictureUrl ||
                        PERSON_FALLBACK_IMAGE_URL
                      }
                      alt="profile picture"
                      size={80}
                      borderColor={
                        pathname.includes("/settings/profile")
                          ? "var(--aqua"
                          : ""
                      }
                      borderWidth="3px"
                    />
                  </div>
                </Link>
                <Link
                  href="mailto:info@populist.us"
                  className={styles.helpBadge}
                >
                  <FaQuestionCircle size={20} />
                  <small>Need help?</small>
                </Link>
              </div>
            </div>
          ) : (
            <div className={styles.flexColumn}>
              <Link href="/register">
                <Button size="medium" variant="primary" label={t("register")} />
              </Link>
              <Link href={`/login?next=${asPath}`}>
                <Button
                  size="medium"
                  variant="secondary"
                  label={t("sign-in")}
                />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DashboardLink({ organization }: { organization: OrganizationResult }) {
  const { isMobile } = useDeviceInfo();

  return (
    <Link href={`/dashboard/${organization.slug}`}>
      <div className={styles.orgDashboardLink}>
        <Avatar
          src={
            organization.assets?.thumbnailImage160 ||
            ORGANIZATION_FALLBACK_IMAGE_URL
          }
          fallbackSrc={ORGANIZATION_FALLBACK_IMAGE_URL}
          alt="organization logo"
          size={isMobile ? 35 : 60}
        />
        <div className={styles.stack}>
          <h5>{organization.name}</h5>
          <small>Dashboard</small>
        </div>
      </div>
    </Link>
  );
}

export { Nav, DashboardLink };
