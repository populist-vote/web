import type { ReactNode } from "react";
import Footer from "../Footer/Footer";
import Nav from "../Nav/Nav";
import styles from "./Layout.module.scss";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className={styles.app}>
      <Nav />
      <main className={styles.content}>{children}</main>
      <Footer />
    </div>
  );
}
