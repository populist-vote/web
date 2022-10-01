/* eslint-disable react/no-unescaped-entities */
import type { NextPage } from "next";

import { Avatar, Footer, LogoText } from "components";
import styles from "styles/modules/about.module.scss";
import SimpleNavStyles from "styles/modules/nav.module.scss";
// import classNames from "classnames";
import { Button, FlagSection } from "components";
import Router from "next/router";
import { useAuth } from "hooks/useAuth";
import { PERSON_FALLBACK_IMAGE_URL } from "utils/constants";
import Link from "next/link";
import useDeviceInfo from "hooks/useDeviceInfo";

const About: NextPage = () => {
  const user = useAuth({ redirectTo: "/about" });
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
                  <li className={SimpleNavStyles.accountProfile}>
                    <Link href="/settings/profile" passHref>
                      <Avatar
                        src={
                          user?.userProfile.profilePictureUrl ||
                          PERSON_FALLBACK_IMAGE_URL
                        }
                        fallbackSrc={PERSON_FALLBACK_IMAGE_URL}
                        alt="profile picture"
                        size={isMobile ? 35 : 60}
                      />
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>

        <div className={styles.contentContainer}>
          <FlagSection title={"About"} hideFlagForMobile={true}>
            <div className={styles.content}>
              <h1>We’re re-imagining the future of our democracy.</h1>
              <p>
                Our political landscape is suffering from a failure of
                imagination. There's a fundamental cynicism undermining the
                innovation we need to address the challenges of today.
                Increasing inequity, social unrest, and decaying trust in our
                leaders, institutions, and politics are all threatening our
                democracy. Technology, once promising, has been recast in the
                shadows and is now a vehicle of misinformation and massive
                corporate influence.
              </p>
              <p>
                A healthy democracy starts with informed citizens. But that's
                just the first step - our goal is to channel the activist in all
                of us. That's what activism is - activating people, and it's
                what drives us at Populist. We center thoughtful and transparent
                design to inspire people to choose agency over inaction.
              </p>
            </div>
          </FlagSection>
        </div>

        <Footer />
      </main>
    </>
  );
};

export default About;
