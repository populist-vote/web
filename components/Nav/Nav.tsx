import Link from "next/link";
import { useRouter } from "next/router";
import { FaHome } from "react-icons/fa";
import { useState } from "react";
import { useScrollPosition } from "hooks/useScrollPosition";
import { useAuth } from "hooks/useAuth";
import styles from "./Nav.module.scss";
import { PERSON_FALLBACK_IMAGE_URL } from "utils/constants";
import { useMediaQuery } from "hooks/useMediaQuery";
import { Avatar, Logo, LogoBeta, Button } from "components";
import clsx from "clsx";
import { useTranslation } from "next-i18next";
import { useOrganizationByIdQuery } from "generated";

function Nav({
  mobileNavTitle,
  showLogoOnMobile,
  hasVotingGuide,
  navItems,
}: {
  mobileNavTitle?: string;
  showLogoOnMobile: boolean;
  hasVotingGuide?: boolean;
  navItems: {
    label: string;
    href: string;
  }[];
}) {
  const [sticky, setSticky] = useState<boolean>(true);
  const { asPath, pathname } = useRouter();
  const { user } = useAuth({ redirectTo: asPath });
  const isSmallScreen = useMediaQuery("(max-width: 768px)");
  const { t } = useTranslation(["auth", "common"]);

  const { data } = useOrganizationByIdQuery(
    {
      id: user?.organizationId || "",
    },
    {
      enabled: !!user?.organizationId,
    }
  );

  const organization = data?.organizationById;

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
      {/* ///////// Mobile Nav ///////// */}

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

      {/* ///////// Desktop nav ///////// */}

      <div className={styles.navContent}>
        <Link href="/home" passHref>
          <div className={styles.logoContainer}>
            <Logo height={100} />
          </div>
        </Link>
        <div className={styles.items}>
          <ul>
            {navItems.map(({ label, href }) => {
              const isNavItemActive =
                (pathname.includes(href) && !hasVotingGuide) ||
                (href === "/voting-guides" && hasVotingGuide);

              return (
                <Link href={href} key={href}>
                  <li
                    className={`${styles.navItem} ${
                      isNavItemActive && styles.active
                    }`}
                  >
                    {label}
                  </li>
                </Link>
              );
            })}
          </ul>
          {user ? (
            <div>
              {organization && (
                <Link href={`/dashboard/${organization.slug}`}>
                  <li
                    className={clsx(styles.navItem, {
                      [styles.active as string]:
                        pathname.includes("/dashboard"),
                    })}
                  >
                    {organization.name}
                  </li>
                </Link>
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
    </nav>
  );
}

export { Nav };
