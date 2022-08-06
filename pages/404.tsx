import Image from "next/image";
import Link from "next/link";

import styles from "styles/layout/containers.module.scss";
import PopulistLogo from "public/images/LogoWithText.svg";

export default function NotFound() {
  return (
    <div className={styles.hero}>
      <header>
        <Image src={PopulistLogo} alt="Populist" height={100} priority />
      </header>
      <h1>Sorry, that page doesn&#39;t exist.</h1>
      <h3>404</h3>
      <Link href="/">Return to the Populist home page.</Link>
    </div>
  );
}
