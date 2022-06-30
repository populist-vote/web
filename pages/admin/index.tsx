/* eslint-disable react/no-unescaped-entities */
import type { NextPage } from "next";

import { Avatar, Footer, LogoText } from "components";
import SimpleNavStyles from "styles/SimpleNav.module.scss";
// import classNames from "classnames";
import { Button, FlagSection } from "components";
import Router from "next/router";
import { useAuth } from "hooks/useAuth";
import { PERSON_FALLBACK_IMAGE_URL } from "utils/constants";
import Link from "next/link";
import useDeviceInfo from "hooks/useDeviceInfo";
import { Role, useUserCountQuery } from "generated";
import styles from "styles/page.module.scss";
import classNames from "classnames";

const AdminPanel: NextPage = () => {
  const user = useAuth({ redirectTo: "/login", minRole: Role.Staff });
  const { isMobile } = useDeviceInfo();

  const { data } = useUserCountQuery();

  return (
    <>
      <main className={styles.container}>
        <div className={SimpleNavStyles.navContainer}>
          <div className={SimpleNavStyles.logoContainer}>
            <Link href="/" passHref>
              <LogoText />
            </Link>
          </div>
          <div className={SimpleNavStyles.break}></div>
          <div className={SimpleNavStyles.menuContainer}>
            <ul className={SimpleNavStyles.menu}>
              {!user && (
                <>
                  <li>
                    <Link href="/about" passHref>
                      ABOUT
                    </Link>
                  </li>
                  <li>
                    <Link href="/faq" passHref>
                      FAQ
                    </Link>
                  </li>
                  <li>
                    <Button
                      size={isMobile ? "small" : "medium"}
                      variant="primary"
                      theme="blue"
                      label="Sign in"
                      onClick={() => Router.push(`/login`)}
                    />
                  </li>
                  <li className={SimpleNavStyles.menuButton}>
                    <Button
                      size={isMobile ? "small" : "medium"}
                      variant="secondary"
                      theme="blue"
                      label="Register"
                      onClick={() => Router.push(`/register`)}
                    />
                  </li>
                </>
              )}
              {user && (
                <>
                  <li>
                    <Link href="/about" passHref>
                      ABOUT
                    </Link>
                  </li>
                  <li>
                    <Link href="/faq" passHref>
                      FAQ
                    </Link>
                  </li>
                  <li className={SimpleNavStyles.accountProfile}>
                    <Link href="/settings/profile" passHref>
                      <Avatar
                        src={PERSON_FALLBACK_IMAGE_URL}
                        fallbackSrc={PERSON_FALLBACK_IMAGE_URL}
                        alt="profile picture"
                        size={isMobile ? 35 : 60}
                      />
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>

        <div className={styles.contentContainer}>
          <FlagSection title={"Admin Panel"} hideFlagForMobile={true}>
            <div className={classNames(styles.adminBox, styles.flexBetween)}>
              <span className={styles.itemHeader}>Total Users</span>
              <div className={styles.dots} />
              <h1>{data?.userCount}</h1>
            </div>
          </FlagSection>
        </div>

        <Footer />
      </main>
    </>
  );
};

export default AdminPanel;
