/* eslint-disable react/no-unescaped-entities */
import type { NextPage } from "next";

import { Avatar, Footer, LogoText } from "components";
import styles from "styles/faq.module.scss";
import SimpleNavStyles from "styles/SimpleNav.module.scss";
// import classNames from "classnames";
import { Button, FlagSection } from "components";
import Router from "next/router";
import { useAuth } from "hooks/useAuth";
import { PERSON_FALLBACK_IMAGE_URL } from "utils/constants";
import Link from "next/link";
import useDeviceInfo from "hooks/useDeviceInfo";

const Faq: NextPage = () => {
  const user = useAuth({ redirectTo: "/faq" });
  const { isMobile } = useDeviceInfo();

  return (
    <>
      <main className={styles.container}>

        <div className={SimpleNavStyles.navContainer}>
          <div className={SimpleNavStyles.logoContainer}>
            <Link href="/" passHref>
              <LogoText />
            </Link>
          </div>
          <div className={SimpleNavStyles.break}></div>
          <div className={SimpleNavStyles.menuContainer}>
            <ul className={SimpleNavStyles.menu}>
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
                      size={isMobile ? "small" : "medium"}
                      variant="primary"
                      theme="blue"
                      label="Sign in"
                      onClick={() => Router.push(`/login`)}
                    />
                  </li>
                  <li className={SimpleNavStyles.menuButton}>
                    <Button
                      size={isMobile ? "small" : "medium"}
                      variant="secondary"
                      theme="blue"
                      label="Register"
                      onClick={() => Router.push(`/register`)}
                    />
                  </li>
                </>
              )}
              {user && (
                <><li>
                  <Link href="/about" passHref>
                    ABOUT
                  </Link>
                </li>
                <li>
                  <Link href="/faq" passHref>
                    FAQ
                  </Link>
                </li>
                <li className={SimpleNavStyles.accountProfile}>
                    <Link href="/settings/profile" passHref>
                      <Avatar
                        src={PERSON_FALLBACK_IMAGE_URL}
                        fallbackSrc={PERSON_FALLBACK_IMAGE_URL}
                        alt="profile picture"
                        size={isMobile ? 35 : 60} />
                    </Link>
                  </li></>
              )}
            </ul>
          </div>
        </div>
        
        <div className={styles.contentContainer}>
          <FlagSection title={"Frequently Asked Questions"} hideFlagForMobile={true}>
              <div className={styles.content}>
                <h2>What is Populist?</h2>
                <p>
                  Populist is a platform for civic engagement built on transparently
                  sourced data.
                </p>
                <h2 id="no-google-fb-login">
                  Why can't I sign in with Google or Facebook?
                </h2>
                <p>
                  We want you to own your data. When you register for websites and apps
                  with Facebook and Google, you are agreeing to have your behavior on
                  the web tracked and ingested to serve the purposes of these
                  corporations advertising engines.
                </p>
                <p>
                  At Populist, we will never sell your data and you can expect our
                  platform to remain ad free for the forseeable future.
                </p>
                <h2>How was Populist built?</h2>
                <p>
                  All of our code is open source and available{" "}
                  <a
                    className={styles.textLink}
                    href="https://github.com/populist-vote"
                    target="_blank"
                    rel="noreferrer"
                  >
                    on GitHub.
                  </a>{" "}
                  We encourage you to join our community and help us in building a
                  stronger democracy through public civic engagement. If you're
                  interested in contributing, get in touch! Someone on our team would be
                  happy to help you get up and running with our applications.
                </p>
                <h2>
                  Where do you get your data?
                </h2>
                <p>
                  We pull in some of our politician data from <a href="https://justfacts.votesmart.org/" className={styles.textLink} target="_blank" rel="noreferrer">VoteSmart</a>, but we also do our own research, so our data is unique. <a href="https://legiscan.com/" className={styles.textLink} target="_blank" rel="noreferrer">Legiscan</a> is where we get our legislative information.
                </p>
                
              </div>
          </FlagSection>
          {/* <div className={styles.section2}>
            <h2>Moving fast and breaking things is no longer compatible with our modern society.</h2>
          </div> */}
        </div>

        

        <Footer />
          

      </main>
    </>
  );
};

export default Faq;
