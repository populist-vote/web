import Link from "next/link";
import { useRouter } from "next/router";
import { FaChevronLeft } from "react-icons/fa";
import { useState } from "react";
import { useScrollPosition } from "hooks/useScrollPosition";
import { useAuth } from "hooks/useAuth";
import styles from "./Nav.module.scss";
import { PERSON_FALLBACK_IMAGE_URL } from "utils/constants";

import { useMediaQuery } from "hooks/useMediaQuery";
import { Avatar, Logo, LogoText } from "components";

export default function Nav({
  mobileNavTitle = "Colorado Legislators",
  showBackButton,
  showLogoOnMobile,
}: {
  mobileNavTitle?: string;
  showBackButton: boolean;
  showLogoOnMobile: boolean;
}) {
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
      <div className={styles.navContent}>
        <div
          className={`${styles.logoContainer} ${
            !showLogoOnMobile ? styles.hideLogo : ""
          }`}
        >
          {isSmallScreen ? <LogoText /> : <Logo />}
        </div>

        {showBackButton && (
          <Link href={`/politicians`} passHref>
            <a href={`/politicians`} aria-label="Go back">
              <FaChevronLeft
                className={styles.backButton}
                color="var(--white)"
              />
            </a>
          </Link>
        )}
        <h5 className={styles.subTitle}>{mobileNavTitle}</h5>
        <div className={styles.items}>
          <ul>
            <Link href="/ballot" passHref>
              <li
                className={`${styles.navItem} ${
                  pathname.includes("/ballot") &&
                  !query.votingGuideId &&
                  styles.active
                }`}
              >
                Ballot
              </li>
            </Link>
            <Link href="/politicians" passHref>
              <li
                className={`${styles.navItem} ${
                  pathname.includes("/politicians") && styles.active
                }`}
              >
                Politicians
              </li>
            </Link>
            <Link href="/voting-guides" passHref>
              <li
                className={`${styles.navItem} ${
                  (pathname.includes("/voting-guides") ||
                    query.votingGuideId) &&
                  styles.active
                }`}
              >
                Voting Guides
              </li>
            </Link>
          </ul>
          {user ? (
            <Link href="/settings/profile" passHref>
              <div className={styles.avatar}>
                <Avatar
                  src={PERSON_FALLBACK_IMAGE_URL}
                  alt="profile picture"
                  size={80}
                />
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
