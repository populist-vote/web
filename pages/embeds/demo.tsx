import {
  AuthButtons,
  Avatar,
  Button,
  Footer,
  LogoBetaDesktop,
} from "components";
import styles from "styles/modules/about.module.scss";
import SimpleNavStyles from "styles/modules/nav.module.scss";
import { FlagSection } from "components";
import { useAuth } from "hooks/useAuth";
import { PERSON_FALLBACK_IMAGE_URL } from "utils/constants";
import Link from "next/link";
import { SupportedLocale } from "types/global";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import nextI18nextConfig from "next-i18next.config";
import Script from "next/script";
import { FaRegCheckCircle } from "react-icons/fa";

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
export default function Demo() {
  const { user } = useAuth();

  return (
    <>
      <main className={styles.container}>
        <div className={SimpleNavStyles.navContainer}>
          <div className={SimpleNavStyles.logoContainer}>
            <Link href="/" passHref>
              <LogoBetaDesktop />
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
                          size={45}
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
          <FlagSection label="Civic Engagement" hideFlagForMobile={true}>
            <div className={styles.content}>
              <h1>Engage your audience with our interactive civic content.</h1>
              <p>
                Our "Question" embed empowers newsrooms and advocacy
                organizations to directly engage their audiences by allowing
                them to ask any question within their articles, newsletters, or
                web content. This interactive feature lets readers respond to
                key issues, participate in polls, or provide feedback while
                seamlessly collecting valuable information, such as email
                addresses and geographic data, which can be used for follow-ups
                or deeper engagement. The embed integrates smoothly into your
                platform, offering a dynamic way to boost audience participation
                and gather actionable insights in real time.
              </p>
              <div className="populist-6f5c8cc2-58fd-4aaf-9297-bb3577748e4f" />
              <Script
                src="https://www.populist.us/widget-client.js?embedId=6f5c8cc2-58fd-4aaf-9297-bb3577748e4f"
                key="populist-6f5c8cc2-58fd-4aaf-9297-bb3577748e4f"
                data-embed-id="6f5c8cc2-58fd-4aaf-9297-bb3577748e4f"
              />
              <p>
                In addition to driving audience interaction, the "Question"
                embed provides an easy-to-use tool for organizations to tailor
                questions to specific topics or local issues, ensuring relevance
                and maximizing engagement. Responses are collected in a
                structured format, allowing for quick analysis and reporting.
                This feature not only enhances the storytelling experience by
                involving the audience in real-time conversations but also helps
                build a stronger connection with readers through direct input.
                Whether used for gauging public opinion, conducting quick
                surveys, or gathering feedback on specific matters, the
                "Question" embed is a powerful resource for engaging communities
                and fostering meaningful dialogue.
              </p>
              <p>
                Our "Poll" embed offers a flexible way for newsrooms and
                advocacy organizations to pose questions with a set of
                predefined answers, enabling a streamlined and engaging way to
                capture audience opinions. The embed can be configured to
                include a write-in option, allowing for more open-ended
                responses when needed. This feature is perfect for gathering
                quick, quantifiable insights on specific issues or gauging
                public sentiment, while still offering the flexibility for more
                nuanced feedback. Like all our embeds, the "Poll" is easy to
                integrate and enhances audience participation by making it
                simple and intuitive to share opinions on key topics.
              </p>

              <div className="populist-6de0123b-f69a-4548-bf4d-d31e3e14cc09" />
              <Script
                src="https://www.populist.us/widget-client.js?embedId=6de0123b-f69a-4548-bf4d-d31e3e14cc09"
                key="populist-6de0123b-f69a-4548-bf4d-d31e3e14cc09"
                data-embed-id="6de0123b-f69a-4548-bf4d-d31e3e14cc09"
              />
              <p>
                You can configure these interactive embeds to suit your
                organizations needs, including allowing anonymous responses,
                setting custom thank-you messages, and customizing the look and
                feel to match your brand. We can work with you directly to meet
                these needs. The embeds are fully responsive and work seamlessly
                across all devices, ensuring a consistent user experience for
                your audience. With Populist, you can easily create engaging
                content that drives audience participation and fosters
                meaningful conversations around the issues that matter most to
                your community.
              </p>
              <div className={styles.center}>
                <h1>Interested?</h1>
                <Link href="mailto:info@populist.us" passHref>
                  <Button variant="primary" label="Contact Sales" />
                </Link>
                <ul className={styles.contactSales}>
                  <li>
                    <FaRegCheckCircle />
                    <span>Request a full demo</span>
                  </li>
                  <li>
                    <FaRegCheckCircle />
                    <span>Learn about our plans and features</span>
                  </li>
                  <li>
                    <FaRegCheckCircle />
                    <span>Get help with onboarding</span>
                  </li>
                </ul>
              </div>
            </div>
          </FlagSection>
        </div>

        <Footer />
      </main>
    </>
  );
}
