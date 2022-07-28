import Link from "next/link";
import { useRouter } from "next/router";
import { FaChevronLeft, FaHome } from "react-icons/fa";
import { useState } from "react";
import { useScrollPosition } from "hooks/useScrollPosition";
import { useAuth } from "hooks/useAuth";
import styles from "./Nav.module.scss";
import { PERSON_FALLBACK_IMAGE_URL } from "utils/constants";
import { useMediaQuery } from "hooks/useMediaQuery";
import { Avatar, Logo, LogoBeta } from "components";

function Nav({
  mobileNavTitle = "Colorado Legislators",
  showBackButton = true,
  showLogoOnMobile,
  navItems,
}: {
  mobileNavTitle?: string;
  showBackButton: boolean;
  showLogoOnMobile: boolean;
  navItems: {
    label: string;
    href: string;
  }[];
}) {
  const router = useRouter();
  const [sticky, setSticky] = useState<boolean>(true);
  const user = useAuth({ redirectTo: "" });
  const { asPath, pathname, query } = useRouter();
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
      // hack because safari thinks its cool to have a bouncy effect and allow scroll position to exceed 0
      let prevPosY = prevPos.y;
      if (prevPosY > 0) {
        prevPosY = 0;
      }
      const isShow = currPos.y >= prevPosY;
      if (isShow !== sticky) setSticky(isShow);
    },
    [sticky]
  );

  return (
    <nav className={`${styles.nav} ${sticky ? styles.sticky : ""}`}>
      {/* ///////// Mobile Nav ///////// */}

      <div className={styles.mobileNav}>
        {showBackButton ? (
          <div className={styles.backButtonContainer}>
            <FaChevronLeft
              className={styles.backButton}
              color="var(--white)"
              aria-label="Go back"
              onClick={() => router.back()}
            />
          </div>
        ) : (
          <div className={styles.homeButton}>
            <Link href="/home" passHref>
              <FaHome size={"1.7rem"} color="var(--blue)" />
            </Link>
          </div>
        )}

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

        <div className={styles.avatar}>
          <Link href="/settings/profile" passHref>
            <Avatar
              src={PERSON_FALLBACK_IMAGE_URL}
              alt="profile picture"
              size={35}
            />
          </Link>
        </div>
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
            {navItems.map(({ label, href }) => (
              <Link href={href} passHref key={href}>
                <li
                  className={`${styles.navItem} ${
                    (pathname.includes(href) && !query["voting-guide"]) ||
                    (!!query["voting-guide"] &&
                      href === "/voting-guides" &&
                      styles.active)
                  }`}
                >
                  {label}
                </li>
              </Link>
            ))}
          </ul>
          {user ? (
            <Link href="/settings/profile" passHref>
              <div className={styles.avatar}>
                <Avatar
                  src={PERSON_FALLBACK_IMAGE_URL}
                  alt="profile picture"
                  size={80}
                />
                <small className={styles.userName}>{user.username}</small>
              </div>
            </Link>
          ) : (
            <Link href={`/login?next=${asPath}`} passHref>
              <div className={styles.avatar}>Login</div>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export { Nav };
