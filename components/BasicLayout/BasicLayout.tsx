import type { PropsWithChildren } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Footer, LogoBetaDesktop, AuthButtons, Avatar } from "components";
import styles from "./BasicLayout.module.scss";
import { useAuth } from "hooks/useAuth";
import { PERSON_FALLBACK_IMAGE_URL } from "utils/constants";

function BasicLayout({
  children,
  hideFooter = false,
  showAuthButtons = false,
}: PropsWithChildren<{ hideFooter?: boolean; showAuthButtons?: boolean }>) {
  const { pathname, query } = useRouter();
  const user = useAuth({ redirect: false });

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
            Sign in
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
            Create an account
          </Link>
        )}

        {user && (
          <Link href="/settings/profile" passHref>
            <Avatar
              src={
                user?.userProfile.profilePictureUrl || PERSON_FALLBACK_IMAGE_URL
              }
              alt="profile picture"
              size={50}
            />
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
