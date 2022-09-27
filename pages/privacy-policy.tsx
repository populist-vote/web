/* eslint-disable react/no-unescaped-entities */
import type { NextPage } from "next";

import { Avatar, Footer, LogoText } from "components";
import styles from "styles/modules/faq.module.scss";
import SimpleNavStyles from "styles/modules/nav.module.scss";
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
                        src={PERSON_FALLBACK_IMAGE_URL}
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
          <FlagSection
            title={"privacy policy"}
            hideFlagForMobile={true}
          >
            <div className={styles.content}>
              <h2>At Populist we believe everyone has a right to own their data and control how their information is used.</h2>
                <p>
                This privacy policy describes our policies and procedures on the collection, use and disclosure of your information when you use the service, and tells you about your privacy rights and how the law protects you. We only use your information to provide and improve our service.
                </p>
                <p>
                  This privacy policy was last updated September 27, 2022.
                </p>
              <h3>
                Consent
              </h3>
              <p>
                By using our website, you hereby consent to our privacy policy and agree to its terms.
              </p>
              <h3>
                Collecting and Using Your Personal Data
              </h3>
              <p>
                While using our service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you. Personally identifiable information may include, but is not limited to:
                <ul>
                  <li>Email address</li>
                  <li>First and last name</li>
                  <li>Address where you are registered to vote</li>
                  <li>usage data</li>
                </ul>
              </p>
              <h3>
                Usage Data
              </h3>
                <p>
                  usage data is collected automatically when using the service. It may include information such as your device's IP address, browser type, browser version, the pages of our service that you visit, the time and date of your visit, the time spent on those pages, unique device identifiers and other diagnostic data.
                </p>
                <p>
                  When you access the service by or through a mobile device, we may collect certain information automatically, including, but not limited to, the type of mobile device you use, your mobile device unique ID, the IP address of your mobile device, your mobile operating system, the type of mobile Internet browser you use, unique device identifiers and other diagnostic data. We may also collect information that your browser sends whenever you visit our service or when you access the service by or through a mobile device.
                </p>
              <h3>
                Tracking Technologies and Cookies
              </h3>
                <p>
                  We use Cookies and similar tracking technologies to track the activity on Our service and store certain information. Tracking technologies used are beacons, tags, and scripts to collect and track information and to improve and analyze Our service.
                </p>
              <h3>
                Use of Your Personal Data
              </h3>
                <p>
                  The company may use personal data for the following purposes:
                  <ul>
                    <li><strong>To provide and maintain our service</strong>, including to monitor the usage of our service.</li>
                    <li><strong>To manage your Account</strong> and to manage your registration as a user of the service. The personal data you provide can give you access to different functionalities of the service that are available to you as a registered user.</li>
                    <li><strong>For the performance of a contract</strong>, including the development, compliance and undertaking of the purchase contract for the products, items or services you have purchased or of any other contract with us through the service.</li>
                    <li><strong>To contact you</strong> by email, telephone calls, SMS, or other equivalent forms of electronic communication, such as a mobile application's push notifications regarding updates or informative communications related to the functionalities, products or contracted services, including the security updates, when necessary or reasonable for their implementation.</li>
                    <li><strong>To contact you</strong> by email, telephone calls, SMS, or other equivalent forms of electronic communication, such as a mobile application's push notifications regarding updates or informative communications related to the functionalities, products or contracted services, including the security updates, when necessary or reasonable for their implementation.</li>
                    <li><strong>To provide you</strong> with news, special offers and general information about other goods, services and events which we offer that are similar to those that you have already purchased or enquired about unless you have opted not to receive such information.</li>
                    <li><strong>For business transfers:</strong> We may use your information to evaluate or conduct a merger, divestiture, restructuring, reorganization, dissolution, or other sale or transfer of some or all of Our assets, whether as a going concern or as part of bankruptcy, liquidation, or similar proceeding, in which personal data held by us about our service users is among the assets transferred.</li>
                    <li><strong>For other purposes:</strong> We may use your information for other purposes, such as data analysis, identifying usage trends, determining the effectiveness of our promotional campaigns and to evaluate and improve our service, products, services, marketing and your experience.</li>
                  </ul>
                </p>
                <p>
                  We may share your personal information in the following situations:
                  <ul>
                    <li><strong>With service Providers:</strong> We may share your personal information with service Providers to monitor and analyze the use of our service, to contact you.</li>
                    <li><strong>For business transfers:</strong> We may share or transfer your personal information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of Our business to another company.</li>
                    <li><strong>With Affiliates:</strong> We may share your information with Our affiliates, in which case we will require those affiliates to honor this privacy policy. Affiliates include Our parent company and any other subsidiaries, joint venture partners or other companies that We control or that are under common control with us.</li>
                    <li><strong>With business partners:</strong> We may share your information with Our business partners to offer you certain products, services or promotions.</li>
                    <li><strong>With other users:</strong> When you share personal information or otherwise interact in the public areas with other users, such information may be viewed by all users and may be publicly distributed outside.</li>
                    <li><strong>With your consent:</strong> We may disclose your personal information for any other purpose with your consent.</li>
                  </ul>
                </p>
              <h3>
                Retention of Your Personal Data
              </h3>
                <p>
                  The company will retain your personal data only for as long as is necessary for the purposes set out in this privacy policy. We will retain and use your personal data to the extent necessary to comply with our legal obligations (for example, if we are required to retain your data to comply with applicable laws), resolve disputes, and enforce our legal agreements and policies.
                </p>
                <p>
                  The company will also retain usage Data for internal analysis purposes. usage Data is generally retained for a shorter period of time, except when this data is used to strengthen the security or to improve the functionality of Our service, or We are legally obligated to retain this data for longer time periods.
                </p>
              <h3>
                Transfer of Your Personal Data
              </h3>
                <p>
                your information, including personal data, is processed at the company's operating offices and in any other places where the parties involved in the processing are located. It means that this information may be transferred to — and maintained on — computers located outside of your state, province, country or other governmental jurisdiction where the data protection laws may differ than those from your jurisdiction.
                </p>
                <p>
                  your consent to this privacy policy followed by your submission of such information represents your agreement to that transfer.
                </p>
                <p>
                The company will take all steps reasonably necessary to ensure that your data is treated securely and in accordance with this privacy policy and no transfer of your personal data will take place to an organization or a country unless there are adequate controls in place including the security of your data and other personal information.
                </p>
              <h3>
                Deleting Your Personal Data
              </h3>
                <p>
                you have the right to delete or request that We assist in deleting the personal data that We have collected about you.
                </p>
                <p>
                Our service may give you the ability to delete certain information about you from within the service.
                </p>
                <p>
                you may update, amend, or delete your information at any time by signing in to your Account, if you have one, and visiting the account settings section that allows you to manage your personal information. you may also contact us to request access to, correct, or delete any personal information that you have provided to us.
                </p>
                <p>
                Please note, however, that We may need to retain certain information when we have a legal obligation or lawful basis to do so.
                </p>
              <h3>
              Disclosure of Your Personal Data
              </h3>
                <p>
                The company may disclose your personal data in the good faith belief that such action is necessary to:
                  <ul>
                    <li>Comply with a legal obligation</li>
                    <li>Protect and defend the rights or property of the company</li>
                    <li>Prevent or investigate possible wrongdoing in connection with the service</li>
                    <li>Protect the personal safety of users of the service or the public</li>
                    <li>Protect against legal liability</li>
                  </ul>
                </p>
              <h3>
              Security of Your Personal Data
              </h3>
                <p>
                The security of your personal data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While We strive to use commercially acceptable means to protect your personal data, We cannot guarantee its absolute security.
                </p>
              <h3>
              Children's Privacy
              </h3>
                <p>
                Our service does not address anyone under the age of 13. We do not knowingly collect personally identifiable information from anyone under the age of 13. If you are a parent or guardian and you are aware that your child has provided us with personal data, please contact us. If We become aware that We have collected personal data from anyone under the age of 13 without verification of parental consent, We take steps to remove that information from Our servers.
                </p>
                <p>
                If We need to rely on consent as a legal basis for processing your information and your country requires consent from a parent, We may require your parent's consent before We collect and use that information.
                </p>
                <h3>
                Links to Other Websites
              </h3>
                <p>
                Our service may contain links to other websites that are not operated by us. If you click on a third party link, you will be directed to that third party's site. We strongly advise you to review the privacy policy of every site you visit. We have no control over and assume no responsibility for the content, privacy policies or practices of any third party sites or services.
                </p>
                <h3>
                Changes to this Privacy Policy
              </h3>
                <p>
                We may update Our privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page. We will let you know via email and/or a prominent notice on Our service, prior to the change becoming effective and update the "Last updated" date at the top of this privacy policy. you are advised to review this privacy policy periodically for any changes. Changes to this privacy policy are effective when they are posted on this page.
                </p>
                <h3>
                Contact Us
              </h3>
                <p>
                If you have any questions about this privacy policy, you can contact us at <Link href="mailto:info@populist.us" passHref>info@populist.us</Link>.
                </p>
                
            </div>
          </FlagSection>
        </div>

        <Footer />
      </main>
    </>
  );
};

export default Faq;
