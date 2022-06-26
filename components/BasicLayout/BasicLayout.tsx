import type { PropsWithChildren } from "react";
import Footer from "components/Footer/Footer";
import styles from "./BasicLayout.module.scss";
import { LogoBetaDesktop } from "components/Logo/LogoBetaDesktop";
import Link from "next/link";
import { useRouter } from "next/router";

export default function BasicLayout({
  children,
  hideFooter = false,
}: PropsWithChildren<{ hideFooter?: boolean }>) {
  const { pathname, query } = useRouter();

  console.log({ pathname, query });

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
            Log In
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
            Sign Up
          </Link>
        )}
      </header>
      <main className={styles.content}>{children}</main>
      {hideFooter ? <footer /> : <Footer />}
    </div>
  );
}
