import type { PropsWithChildren } from "react";
import Footer from "components/Footer/Footer";
import styles from "./BasicLayout.module.scss";
import { LogoText } from "components/LogoText/LogoText";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCurrentUserQuery } from "generated";

export default function BasicLayout({
  children,
  hideFooter = false,
  hideHeaderActions = false,
}: PropsWithChildren<{ hideFooter?: boolean; hideHeaderActions?: boolean }>) {
  const { pathname } = useRouter();
  const user = useCurrentUserQuery();

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link href="/" passHref>
          <div style={{ width: "10rem", cursor: "pointer" }}>
            <LogoText />
          </div>
        </Link>
        {hideHeaderActions || user ? (
          <></>
        ) : pathname == "/register" ? (
          <Link href="/login">Log In</Link>
        ) : (
          <Link href="/register">Sign Up</Link>
        )}
      </header>
      <main className={styles.content}>{children}</main>
      {hideFooter ? <footer /> : <Footer />}
    </div>
  );
}
