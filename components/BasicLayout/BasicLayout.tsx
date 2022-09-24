import type { PropsWithChildren } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Footer, LogoBetaDesktop, AuthButtons } from "components";
import styles from "./BasicLayout.module.scss";

function BasicLayout({
  children,
  hideFooter = false,
  showAuthButtons = false,
}: PropsWithChildren<{ hideFooter?: boolean; showAuthButtons?: boolean }>) {
  const { pathname, query } = useRouter();

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link href="/" passHref>
          <div style={{ width: "10rem", cursor: "pointer" }}>
            <LogoBetaDesktop />
          </div>
        </Link>

        {(() => {
          switch (pathname) {
            case "/register":
              return (
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
              );
            case "/login":
              return (
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
              );
            default:
              return showAuthButtons ? (
                <div className={styles.auxButtonsDesktop}>
                  <AuthButtons />
                </div>
              ) : (
                <></>
              );
          }
        })()}
      </header>
      <main className={styles.content}>{children}</main>
      {showAuthButtons && (
        <div className={styles.auxButtonsMobile}>
          <AuthButtons />
        </div>
      )}

      {hideFooter ? <footer /> : <Footer />}
    </div>
  );
}

export { BasicLayout };
