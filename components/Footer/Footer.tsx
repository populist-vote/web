import styles from "./Footer.module.scss";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";
import Link from "next/link";
import { BsGithub } from "react-icons/bs";

function Footer() {
  return (
    <footer className={styles.footer}>
      <div
        style={{
          display: "flex",
          gap: "1rem",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p className={styles.copyright}>
          &#169; {new Date().getFullYear()} Populist. &nbsp; 🇺🇸 Made in the USA.
        </p>
      </div>

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
        <li>
          <Link href="mailto:info@populist.us">HELP</Link>
        </li>
      </ul>
      <ul className={styles.socials}>
        <li>
          <a
            href="https://github.com/populist-vote"
            aria-label="Github"
            rel="noreferrer"
            target="_blank"
          >
            <BsGithub />
          </a>
        </li>
        <li>
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
          <a
            href="https://www.instagram.com/populist.us/"
            aria-label="Instagram"
            rel="noreferrer"
            target="_blank"
          >
            <FaInstagram aria-labelledby="populist on instagram" />
          </a>
        </li>
      </ul>
    </footer>
  );
}

export { Footer };
