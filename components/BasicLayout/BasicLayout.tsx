import type { PropsWithChildren } from "react";
import Footer from "components/Footer/Footer";
import styles from "./BasicLayout.module.scss";
import { LogoText } from "components/LogoText/LogoText";
import Link from "next/link";

export default function BasicLayout({
  children,
  hideFooter = false,
}: PropsWithChildren<{ hideFooter?: Boolean }>) {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link href="/" passHref>
          <div style={{ width: "10rem", cursor: "pointer" }}>
            <LogoText />
          </div>
        </Link>
        <Link href="/signin">Sign In</Link>
      </header>
      <main className={styles.content}>{children}</main>
      {hideFooter ? <footer /> : <Footer />}
    </div>
  );
}
