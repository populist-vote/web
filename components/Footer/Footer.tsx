import styles from "./Footer.module.scss";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";
import Link from "next/link";

function Footer() {
  return (
    <footer className={styles.footer}>
      <ul>
        <li>
          <Link href="/about" passHref>
            ABOUT
          </Link>
        </li>
        <li>
          <Link href="/faq" passHref>
            FAQ
          </Link>
        </li>
        <li>
          <Link href="/privacy-policy" passHref>
            PRIVACY
          </Link>
        </li>
      </ul>
      <ul className={styles.socials}>
        <li>
          {" "}
          <a
            href="https://www.facebook.com/populist.us"
            rel="noreferrer"
            target="_blank"
          >
            <FaFacebookF />
          </a>
        </li>

        <li>
          {" "}
          <a
            href="https://twitter.com/populist_us"
            rel="noreferrer"
            target="_blank"
          >
            <FaTwitter />
          </a>
        </li>

        <li>
          {" "}
          <a
            href="https://www.instagram.com/populist.us/"
            rel="noreferrer"
            target="_blank"
          >
            <FaInstagram />
          </a>
        </li>
      </ul>
      <p className={styles.copyright}>
        &#169; {new Date().getFullYear()} Populist. &nbsp;Made in Colorado.
      </p>
    </footer>
  );
}

export { Footer };
