import styles from "./Footer.module.scss";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";
import Link from "next/link";


export default function Footer() {
  return (
    <footer className={styles.footer}>
      
      <p>
        <ul>
          <li><Link href="/about" passHref>ABOUT</Link></li>
          <li><Link href="/faq" passHref>FAQ</Link></li>
        </ul>
        <a
          href="https://www.facebook.com/populist.us"
          rel="noreferrer"
          target="_blank"
        >
          <FaFacebookF />
        </a>
        <a
          href="https://twitter.com/populist_us"
          rel="noreferrer"
          target="_blank"
        >
          <FaTwitter />
        </a>
        <a
          href="https://www.instagram.com/populist.us/"
          rel="noreferrer"
          target="_blank"
        >
          <FaInstagram />
        </a>
      </p>
      <p id="copyright">
        &#169; {new Date().getFullYear()} Populist. &nbsp;Made in Colorado.
      </p>
    </footer>
  );
}
