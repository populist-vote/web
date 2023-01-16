/* eslint-disable react/no-unescaped-entities */
import type { NextPage } from "next";
import { AuthButtons, Avatar, Footer, LogoText } from "components";
import styles from "styles/modules/about.module.scss";
import SimpleNavStyles from "styles/modules/nav.module.scss";
import { FlagSection } from "components";
import { useAuth } from "hooks/useAuth";
import { PERSON_FALLBACK_IMAGE_URL } from "utils/constants";
import Link from "next/link";
import useDeviceInfo from "hooks/useDeviceInfo";
import { SupportedLocale } from "global";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import nextI18nextConfig from "next-i18next.config";

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
                  <AuthButtons />
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
                </>
              )}
            </ul>
          </div>
        </div>

        <div className={styles.contentContainer}>
          <FlagSection label="About" hideFlagForMobile={true}>
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
