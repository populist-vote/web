/* eslint-disable react/no-unescaped-entities */
import type { NextPage } from "next";
import Image from "next/image";
import headerLogo from "public/images/LogoWithText.svg";
import landing0 from "public/images/landing/politicianBrowser-new.webp";
import landing0fallback from "public/images/landing/politicianBrowser-fallback.jpg";
import landing1 from "public/images/landing/ballot.jpg";
import landing2 from "public/images/landing/action.jpg";
import landing3 from "public/images/landing/3.png";
import landing4 from "public/images/landing/Connections.png";
import { Avatar, Footer, ImageWithFallback } from "components";
import styles from "styles/landing.module.scss";
import classNames from "classnames";
import { Button } from "components";
import Router from "next/router";
import { useAuth } from "hooks/useAuth";
import { PERSON_FALLBACK_IMAGE_URL } from "utils/constants";
import Link from "next/link";

const Home: NextPage = () => {
  const user = useAuth({ redirectTo: "/" });
  return (
    <>
      <main className={styles.container}>
        <div id={styles["container1"]}>
          <div id={styles["menu"]}>
            <ul className={styles["nav"]}>
              {!user && (
                <>
                  <li>
                    <Button
                      size="large"
                      variant="primary"
                      theme="blue"
                      label="Sign in"
                      onClick={() => Router.push(`/login`)}
                    />
                  </li>
                  <li>
                    <Button
                      size="large"
                      variant="secondary"
                      theme="blue"
                      label="Register"
                      onClick={() => Router.push(`/register`)}
                    />
                  </li>
                </>
              )}
              {user && (
                <Link href="/settings/profile" passHref>
                  <Avatar
                    src={PERSON_FALLBACK_IMAGE_URL}
                    fallbackSrc={PERSON_FALLBACK_IMAGE_URL}
                    alt="profile picture"
                    size={80}
                  />
                </Link>
              )}
            </ul>
          </div>

          <div id={styles["section1"]}>
            <Image
              id="logo"
              src={headerLogo}
              width="555px"
              height="83px"
              alt="🇺🇸Populist"
            />
          </div>

          <div id={styles["section1c"]}>
            <div id={styles["s1ccol1"]}>
              <ImageWithFallback
                src={landing0}
                fallbackSrc={landing0fallback}
                height="540px"
                alt="Politician browser on mobile"
                priority
              />
            </div>
            <div id={styles["s1ccol2"]}>
              <h2>Transparent government access.</h2>
              <p>
                We believe that with better access to transparent, non-partisan
                information, we can create a well-informed and critical
                public—the foundation of a more equitable democracy for all.
              </p>
              <p>
                It's time to change the way we engage with our government. From
                federal to local, ballots to bills, we’re bringing power back to
                the people.
              </p>
              <Button
                size="large"
                variant="primary"
                theme="yellow"
                label="Explore the app"
                onClick={() => Router.push(`/home`)}
              />
            </div>
          </div>

          <div id={styles["section1b"]}>
            <div id={styles["s1bcol1"]}>
              <div className={styles.contentwide}>
                <h2>It begins at the ballot.</h2>
                <p>
                  Easily research your ballot, create a personalized voting
                  guide, and share it with your friends.
                </p>
                <Button
                  size="large"
                  variant="primary"
                  theme="aqua"
                  label="View your ballot"
                  onClick={() => Router.push(`/ballot`)}
                />
              </div>
            </div>
            <div id={styles["s1bcol2"]}>
              <Image src={landing1} alt="My ballot on mobile" />
            </div>
          </div>

          <div id={styles["section2"]}>
            <div id={styles["s2col1"]}>
              <Image src={landing2} alt="desktop browser" />
            </div>
            <div id={styles["s2col2"]}>
              <div className={styles.contentwide}>
                <h2>New avenues of action.</h2>
                <p>
                  Extend the power of your vote beyond the ballot box by letting
                  your representatives know your position on key legislation and
                  issues.
                </p>
              </div>
            </div>
          </div>

          <div id={styles["section3"]}>
            <div id={styles["s3col1"]}>
              <div className={styles.contentwide}>
                <h2>Transparent, modern, and ethical.</h2>
                <p>
                  Moving fast and breaking things is no longer compatible with
                  our modern society. We lead with thoughtful design that is
                  responsible to people, not profits.
                </p>
              </div>
            </div>
            <div id={styles["s3col2"]}>
              <Image src={landing3} alt="transparency into our algorithms" />
            </div>
          </div>

          <div id={styles["section4"]}>
            <div id={styles["s4row1"]}>
              <div className={styles.contentwide2}>
                <Image
                  src={landing4}
                  alt="people becoming involved in government"
                />
                <h2>
                  Populist is for{" "}
                  <span className={styles.emphasized}>voters</span>,{" "}
                  <span className={styles.emphasized}>organizations</span>, and{" "}
                  <span className={styles.emphasized}>politicians</span>.
                </h2>
                <p>
                  By creating and surfacing connections between these key
                  stakeholders, we can make meaningful action more accessible
                  and build a stronger democracy.
                </p>
              </div>
            </div>
            <div id={styles["s4row2"]}>
              <div className={classNames(styles.contentwide, styles.last)}>
                <h2 className={styles.botspace}>
                  Interested? Sign up to learn more.
                </h2>

                <div id={styles["mc_embed_signup"]}>
                  <form
                    action="https://populist.us2.list-manage.com/subscribe/post?u=f24fbd8a9a3cd91b78cb4a457&amp;id=361b16ea14"
                    method="post"
                    id={styles["mc-embedded-subscribe-form"]}
                    name="mc-embedded-subscribe-form"
                    className={styles.validate}
                    target="_blank"
                    noValidate
                  >
                    <div id={styles["mc_embed_signup_scroll"]}>
                      <input
                        type="email"
                        name="EMAIL"
                        className={styles.email}
                        id={styles["mce-EMAIL"]}
                        placeholder="Email address"
                        required
                      />
                      <div
                        style={{ position: "absolute", left: "-5000px" }}
                        aria-hidden="true"
                      >
                        <input
                          type="text"
                          name="b_f24fbd8a9a3cd91b78cb4a457_361b16ea14"
                          tabIndex={-1}
                        />
                      </div>
                      <div className={styles.clear}>
                        <input
                          type="submit"
                          value="Submit"
                          name="subscribe"
                          id={styles["mc-embedded-subscribe"]}
                          className={styles.button}
                        />
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            <Footer />
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
