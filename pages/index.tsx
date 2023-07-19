/* eslint-disable react/no-unescaped-entities */
import type { NextPage } from "next";
import LegacyImage from "next/legacy/image";
import Image from "next/image";
import headerLogo from "public/images/LogoWithText.svg";
import landing0 from "public/images/landing/politicianBrowser-new.webp";
import landing1 from "public/images/landing/citizen-my-ballot.png";
import landing2 from "public/images/landing/citizen-voting-guide.png";
import landing3 from "public/images/landing/citizen-legislation.png";
import landing4 from "public/images/landing/org-enhance.png";
import landing5 from "public/images/landing/org-create.png";
import landing6 from "public/images/landing/org-engage.png";
import { Avatar, Footer, Button, MPRLogo } from "components";
import styles from "styles/modules/landing.module.scss";
import Router from "next/router";
import { useAuth } from "hooks/useAuth";
import { PERSON_FALLBACK_IMAGE_URL } from "utils/constants";
import Link from "next/link";
import { SupportedLocale } from "types/global";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import nextI18nextConfig from "next-i18next.config";
import { useTranslation } from "next-i18next";
import clsx from "clsx";

export async function getServerSideProps({
  locale,
}: {
  locale: SupportedLocale;
}) {
  return {
    props: {
      ...(await serverSideTranslations(
        locale,
        ["auth", "common"],
        nextI18nextConfig
      )),
    },
  };
}

const Home: NextPage = () => {
  const { user } = useAuth({ redirectTo: "/" });
  const { t } = useTranslation(["auth", "common"]);

  return (
    <main className={styles.container}>
      <div id={styles["container1"]}>
        <div className={styles.menuContainer}>
          <ul>
            {!user && (
              <>
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
                  <Button
                    size={"medium"}
                    variant="secondary"
                    theme="blue"
                    label={t("sign-in")}
                    onClick={() => Router.push(`/login`)}
                  />
                </li>
                <li className={styles.menuButton}>
                  <Button
                    size={"medium"}
                    variant="primary"
                    theme="blue"
                    label={t("get-started", { ns: "common" })}
                    onClick={() => Router.push(`/register`)}
                  />
                </li>
              </>
            )}
            {user && (
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
                <li className={styles.accountProfile}>
                  <Link href="/settings/profile" passHref>
                    <div>
                      <Avatar
                        src={
                          user?.userProfile.profilePictureUrl ||
                          PERSON_FALLBACK_IMAGE_URL
                        }
                        fallbackSrc={PERSON_FALLBACK_IMAGE_URL}
                        alt="profile picture"
                        size={50}
                      />
                    </div>
                  </Link>
                </li>
              </ul>
            )}
          </ul>
        </div>

        <div className={styles.headerLogo}>
          <LegacyImage
            src={headerLogo}
            width="555"
            height="83"
            style={{ objectFit: "contain" }}
            alt="🇺🇸Populist"
          />
        </div>
        <section className={styles.headerSection}>
          <div className={styles.headerImage}>
            <Image
              src={landing0}
              alt="Politician browser on mobile"
              height={400}
              quality={50}
            />
          </div>

          <div className={styles.headerCopy}>
            <h2>
              Not a social network, <br /> a <strong>civic network</strong>.
            </h2>
            <p>
              Connecting people to democracy through our civic data and
              engagement tools.
            </p>
            <Button
              size="large"
              variant="primary"
              theme="yellow"
              label="Explore the app"
              onClick={() => Router.push(`/home`)}
            />
          </div>
        </section>

        <section className={styles.blueBand}>
          <MPRLogo />
          <h2>We've partnered with Minnesota Public Radio.</h2>
        </section>

        <div className={styles.infoColumns}>
          <div className={styles.leftColumn}>
            <section>
              <h4>For Citizens</h4>
              <p>
                Clear, non-partisan information—from federal to local, ballots
                to bills.
              </p>
            </section>
            <section>
              <Image src={landing1} alt="computer" height={250} />
              <h5>It starts at the ballot.</h5>
              <p>
                Research candidates to see endorsements, sponsored bills,
                donors, and more.
              </p>
            </section>
            <section>
              <Image src={landing2} alt="computer" width={250} />
              <h5>Share who you're voting for.</h5>
              <p>Create private or public voting guides, including notes.</p>
            </section>
            <section>
              <Image src={landing3} alt="computer" height={250} />
              <h5>Take action on legislation.</h5>
              <p>Voice your position on legislation and issues</p>
            </section>
          </div>
          <div className={styles.rightColumn}>
            <section>
              <h4>For Organizations</h4>
              <p>Easy-to-embed civic content with built-in engagement.</p>
            </section>
            <section>
              <Image src={landing4} alt="computer" height={250} />
              <h5>Enhance your reporting.</h5>
              <p>
                Add valuable context to political stories with our clear, simple
                civic data embeds.
              </p>
            </section>
            <section>
              <Image src={landing5} alt="computer" height={250} />
              <h5>Create content.</h5>
              <p>
                Easily generate candidate guides and other content with our
                automated reporting tools.
              </p>
            </section>
            <section>
              <Image src={landing6} alt="computer" height={250} />
              <h5>Engage audiences.</h5>
              <p>
                Discover audience insight with built-in engagement and no extra
                work.
              </p>
            </section>
          </div>
        </div>
        <section className={clsx(styles.blueBand, styles.flexBetween)}>
          <Avatar
            size={100}
            alt="Michael Olson"
            src={"/images/landing/olson-headshot.png"}
          />
          <figure className={styles.quote}>
            <blockquote>
              “Populist helps us easily supplement our articles with up-to-date
              civic information, creating a more engaging experience for
              audiences.
            </blockquote>
            <cite>Michael Olson, Deputy Managing Editor of MPR</cite>
          </figure>
        </section>
        <section className={styles.cta}>
          <h2>Interested? Create an account now.</h2>
          <Link href="/register" passHref>
            <Button size="large" label="Get Started" variant="primary" />
          </Link>
        </section>

        <Footer />
      </div>
    </main>
  );
};

export default Home;
