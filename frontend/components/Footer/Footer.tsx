import styles from "./Footer.module.scss";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";
import Link from "next/link";

function Footer() {
  return (
    <footer className={styles.footer}>
      <p className={styles.copyright}>
        &#169; {new Date().getFullYear()} Populist. &nbsp; 🇺🇸 Made in the USA.
      </p>
      <ul className={styles.links}>
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
            aria-label="Facebook"
            rel="noreferrer"
            target="_blank"
          >
            <FaFacebookF aria-labelledby="populist on facebook" />
          </a>
        </li>

        <li>
          {" "}
          <a
            href="https://twitter.com/populist_us"
            aria-label="Twitter"
            rel="noreferrer"
            target="_blank"
          >
            <FaTwitter aria-labelledby="populist on twitter" />
          </a>
        </li>

        <li>
          {" "}
          <a
            href="https://www.instagram.com/populist.us/"
            aria-label="Instagram"
            rel="noreferrer"
            target="_blank"
          >
            <FaInstagram aria-labelledby="populist on instagram" />
          </a>
        </li>

        {/* <li>
          <div className={styles.platformStatus}>
            <span>
              Status <FaCircle color={"var(--green)"} />{" "}
              <span className={styles.statusText}>
                All systems operational.
              </span>
            </span>
          </div>
        </li> */}
      </ul>
    </footer>
  );
}

export { Footer };
