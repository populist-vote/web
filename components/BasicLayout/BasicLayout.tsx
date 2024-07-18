import type { PropsWithChildren } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import {
  Footer,
  LogoBetaDesktop,
  AuthButtons,
  Avatar,
  DashboardLink,
} from "components";
import { useAuth } from "hooks/useAuth";
import { PERSON_FALLBACK_IMAGE_URL } from "utils/constants";
import { useOrganizationBySlugQuery } from "generated";
import styles from "./BasicLayout.module.scss";
import useDeviceInfo from "hooks/useDeviceInfo";
import clsx from "clsx";

function BasicLayout({
  children,
  hideHeader = false,
  hideAuthButtons = false,
  hideFooter = false,
  hideTextMenu = true,
  withBackdrop = false,
}: PropsWithChildren<{
  hideHeader?: boolean;
  hideAuthButtons?: boolean;
  hideFooter?: boolean;
  hideTextMenu?: boolean;
  withBackdrop?: boolean;
}>) {
  return (
    <div
      className={clsx(styles.container, {
        [styles.withBackdrop as string]: withBackdrop,
      })}
    >
      {!hideHeader && (
        <BasicHeader
          hideAuthButtons={hideAuthButtons}
          hideTextMenu={hideTextMenu}
        />
      )}
      <main className={styles.content}>{children}</main>
      {hideFooter ? <footer /> : <Footer />}
    </div>
  );
}

function BasicHeader({
  hideAuthButtons = false,
  hideTextMenu = true,
}: {
  hideAuthButtons?: boolean;
  hideTextMenu?: boolean;
}) {
  const { pathname } = useRouter();
  const { user } = useAuth();
  const router = useRouter();
  const slug = router.query.slug as string;

  const { data, isLoading } = useOrganizationBySlugQuery(
    {
      slug,
    },
    {
      enabled: !!slug,
    }
  );

  const { isMobile } = useDeviceInfo();
  if (isLoading) return null;
  const organization = data?.organizationBySlug;

  return (
    <header className={styles.header}>
      <Link href="/" passHref>
        <div className={styles.logoContainer}>
          <LogoBetaDesktop />
        </div>
      </Link>
      <div>
        <ul className={styles.menu}>
          {!hideTextMenu && (
            <ul className={styles.textMenu}>
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
            </ul>
          )}
          {!hideAuthButtons && !user && (
            <li>
              <AuthButtons />
            </li>
          )}
          {user && (
            <li>
              <div className={styles.linkSection}>
                {organization && pathname === "/home" && (
                  <div className={styles.dashboardLink}>
                    <DashboardLink />
                  </div>
                )}
                <Link href="/settings/profile" passHref>
                  <div style={{ cursor: "pointer" }}>
                    <Avatar
                      src={
                        user?.userProfile.profilePictureUrl ||
                        PERSON_FALLBACK_IMAGE_URL
                      }
                      alt="profile picture"
                      size={isMobile ? 35 : 60}
                    />
                  </div>
                </Link>
              </div>
            </li>
          )}
        </ul>
      </div>
    </header>
  );
}

export { BasicLayout, BasicHeader };
