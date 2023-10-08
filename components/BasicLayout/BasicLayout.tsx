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
import { OrganizationResult, useOrganizationByIdQuery } from "generated";
import styles from "./BasicLayout.module.scss";
import useDeviceInfo from "hooks/useDeviceInfo";

function BasicLayout({
  children,
  hideAuthButtons = false,
  hideFooter = false,
  hideTextMenu = true,
}: PropsWithChildren<{
  hideAuthButtons?: boolean;
  hideFooter?: boolean;
  hideTextMenu?: boolean;
}>) {
  return (
    <div className={styles.container}>
      <BasicHeader
        hideAuthButtons={hideAuthButtons}
        hideTextMenu={hideTextMenu}
      />
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
  const { user } = useAuth({ redirect: false });

  const { data } = useOrganizationByIdQuery(
    {
      id: user?.organizationId || "",
    },
    {
      enabled: !!user?.organizationId,
    }
  );

  const organization = data?.organizationById;
  const { isMobile } = useDeviceInfo();

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
                    <DashboardLink
                      organization={organization as OrganizationResult}
                    />
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
