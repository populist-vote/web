import type { PropsWithChildren } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Footer, LogoBetaDesktop, AuthButtons, Avatar } from "components";
import styles from "./BasicLayout.module.scss";
import { useAuth } from "hooks/useAuth";
import { PERSON_FALLBACK_IMAGE_URL } from "utils/constants";
import { useTranslation } from "next-i18next";

function BasicLayout({
  children,
  hideFooter = false,
  showAuthButtons = false,
}: PropsWithChildren<{ hideFooter?: boolean; showAuthButtons?: boolean }>) {
  const { pathname, query } = useRouter();
  const user = useAuth({ redirect: false });
  const { t } = useTranslation(["common", "auth"]);

  return (
    <div className={styles.container}>
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
        )}
      </header>
      <main className={styles.content}>
        <div />
        {children}
        <div>{showAuthButtons && !user && <AuthButtons />}</div>
      </main>
      {hideFooter ? <footer /> : <Footer />}
    </div>
  );
}

export { BasicLayout };
