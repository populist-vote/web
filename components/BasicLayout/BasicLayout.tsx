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

function BasicLayout({
  children,
  hideAuthButtons = false,
  hideFooter = false,
}: PropsWithChildren<{
  hideAuthButtons?: boolean;
  hideFooter?: boolean;
}>) {
  return (
    <div className={styles.container}>
      <BasicHeader hideAuthButtons={hideAuthButtons} />
      <main className={styles.content}>{children}</main>
      {hideFooter ? <footer /> : <Footer />}
    </div>
  );
}

function BasicHeader({
  hideAuthButtons = false,
}: {
  hideAuthButtons?: boolean;
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

  return (
    <header className={styles.header}>
      <Link href="/" passHref>
        <div style={{ width: "10rem", cursor: "pointer" }}>
          <LogoBetaDesktop />
        </div>
      </Link>
      <div>
        {!hideAuthButtons && <AuthButtons />}
        {user && (
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
                  size={35}
                />
              </div>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}

export { BasicLayout, BasicHeader };
