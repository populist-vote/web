import type { PropsWithChildren } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

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
  hideFooter = false,
  showAuthButtons = false,
}: PropsWithChildren<{ hideFooter?: boolean; showAuthButtons?: boolean }>) {
  const { user } = useAuth({ redirect: false });

  return (
    <div className={styles.container}>
      <BasicHeader />
      <main className={styles.content}>
        <div />
        {children}
        <div>{showAuthButtons && !user && <AuthButtons />}</div>
      </main>
      {hideFooter ? <footer /> : <Footer />}
    </div>
  );
}

function BasicHeader() {
  const { pathname, query } = useRouter();
  const { t } = useTranslation(["auth", "common"]);
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

      {pathname === "/register" && (
        <Link
          href={{
            pathname: "/login",
            query,
          }}
          shallow
          replace
        >
          {t("sign-in")}
        </Link>
      )}

      {pathname === "/login" && (
        <Link
          href={{
            pathname: "/register",
            query,
          }}
          shallow
          replace
        >
          {t("get-started", { ns: "common" })}
        </Link>
      )}

      {user && (
        <div className={styles.linkSection}>
          {organization && (
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
    </header>
  );
}

export { BasicLayout, BasicHeader };
