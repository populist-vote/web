import type { PropsWithChildren } from "react";
import { Footer, LogoBetaDesktop } from "components";
import styles from "./BasicLayout.module.scss";
import Link from "next/link";
import { useRouter } from "next/router";

function BasicLayout({
  children,
  hideFooter = false,
}: PropsWithChildren<{ hideFooter?: boolean }>) {
  const { pathname, query } = useRouter();

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link href="/" passHref>
          <div style={{ width: "10rem", cursor: "pointer" }}>
            <LogoBetaDesktop />
          </div>
        </Link>
        {pathname == "/register" && (
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
        {pathname == "/login" && (
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
      </header>
      <main className={styles.content}>{children}</main>
      {hideFooter ? <footer /> : <Footer />}
    </div>
  );
}

export { BasicLayout };
