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
import { AuthButtons, Avatar, Footer, Button, MPRLogo } from "components";
import styles from "styles/modules/landing.module.scss";
import Router from "next/router";
import { useAuth } from "hooks/useAuth";
import { PERSON_FALLBACK_IMAGE_URL } from "utils/constants";
import Link from "next/link";
import { SupportedLocale } from "types/global";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import nextI18nextConfig from "next-i18next.config";
import clsx from "clsx";
import useDeviceInfo from "hooks/useDeviceInfo";

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
  const { user } = useAuth();
  const { isMobile } = useDeviceInfo();

  return (
    <main className={styles.container}>
      <div id={styles["container1"]}>
        <div className={styles.menuContainer}>
          <ul className={styles.menu}>
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
                <AuthButtons />
              </>
            )}
            {user && (
              <ul className={styles.menu}>
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
                        size={isMobile ? 35 : 60}
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
              height={500}
              quality={50}
            />
          </div>

          <div className={styles.headerCopy}>
            <h2 className={styles.headerTitle}>
              Not a social network, a civic network.
            </h2>
            <p>
              Connecting people to democracy through our civic data and
              engagement tools.
              <Button
                size="large"
                variant="primary"
                theme="yellow"
                label="Explore the app"
                onClick={() => Router.push(`/home`)}
              />
            </p>
          </div>
        </section>

        <section className={styles.blueBand}>
          <div className={styles.contentContainer}>
            <MPRLogo />
            <h2>We've partnered with Minnesota Public Radio.</h2>
          </div>
        </section>

        <div className={styles.infoColumns}>
          <div className={styles.leftColumn}>
            <section className={styles.left1}>
              <h4>For Citizens</h4>
              <p>
                Clear, non-partisan information — from federal to local, ballots
                to bills.
              </p>
            </section>
            <section className={styles.bgGradient}>
              <Image
                src={landing1}
                alt="computer"
                height={275}
                className={styles.ballotImage}
              />
              <h5 className={styles.ballotTitle}>It starts at the ballot.</h5>
              <p>
                Research candidates to see endorsements, sponsored bills,
                donors, and more.
              </p>
            </section>
            <section className={styles.bgGradient}>
              <Image src={landing2} alt="computer" height={250} />
              <h5>Share who you're voting for.</h5>
              <p>Create private or public voting guides, including notes.</p>
            </section>
            <section className={styles.bgGradient}>
              <Image
                src={landing3}
                alt="computer"
                height={250}
                className={styles.legislationImage}
              />
              <h5>Take action on legislation.</h5>
              <p>Voice your position on legislation and issues</p>
              <Button
                size="large"
                label="View your ballot"
                variant="primary"
                theme="yellow"
                onClick={() => Router.push(`/ballot`)}
              />
            </section>
          </div>
          <div className={styles.rightColumn}>
            <section>
              <h4>For Organizations</h4>
              <p>Easy-to-embed civic content with built-in engagement.</p>
            </section>
            <section className={styles.bgGradient}>
              <Image
                src={landing4}
                alt="computer"
                height={250}
                className={styles.enhanceImage}
              />
              <h5>Enhance your reporting.</h5>
              <p>
                Add valuable context to political stories with our clear, simple
                civic data embeds.
              </p>
            </section>
            <section className={styles.bgGradient}>
              <Image
                src={landing5}
                alt="computer"
                height={250}
                className={styles.createImage}
              />
              <h5>Create content.</h5>
              <p>
                Easily generate candidate guides and other content with our
                automated reporting tools.
              </p>
            </section>
            <section className={styles.bgGradient}>
              <Image
                src={landing6}
                alt="computer"
                height={250}
                className={styles.engageImage}
              />
              <h5>Engage audiences.</h5>
              <p>
                Discover audience insight with built-in engagement and no extra
                work.
              </p>
              <Link href="mailto:info@populist.us" passHref>
                <Button size="large" label="Request a demo" variant="primary" />
              </Link>
            </section>
          </div>
        </div>
        <section className={clsx(styles.blueBand, styles.flexBetween)}>
          <div className={styles.contentContainer}>
            <Image
              src={"/images/landing/michael-olson.jpg"}
              alt="Michael Olson"
              height={175}
              width={175}
              className={styles.michaelOlson}
            />
            <figure className={styles.quote}>
              <blockquote>
                “Populist helps us easily supplement our articles with
                up-to-date civic information, creating a more engaging
                experience for audiences.”
              </blockquote>
              <cite>Michael Olson, Deputy Managing Editor of MPR</cite>
            </figure>
          </div>
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
