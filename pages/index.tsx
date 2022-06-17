/* eslint-disable react/no-unescaped-entities */
import type { NextPage } from "next";
import Image from "next/image";
import headerLogo from "public/images/LogoWithText.svg";
import landing1 from "public/images/landing/politicianBrowser.webp";
import landing1fallback from "public/images/landing/1.png";
import landing2 from "public/images/landing/amplify.png";
import landing3 from "public/images/landing/3.png";
import landing4 from "public/images/landing/Connections.png";
import { Footer, ImageWithFallback } from "components";
import styles from "styles/landing.module.scss";
import classNames from "classnames";

// XXX: VERY SCARY THING THAT WE NEED TO FIX
const Home: NextPage = () => {
  return (
    <>
      <main className={styles.container}>
        <div id={styles["container1"]}>
          <div id={styles["section1"]}>
            <div className={styles.content}>
              <Image
                id="logo"
                src={headerLogo}
                width="555px"
                height="83px"
                alt="🇺🇸Populist"
              />
              <h1>Non-partisan politics for the people.</h1>
              <p>We believe in people.</p>
              <p>
                In transparent, non-partisan, accessible information. In a
                well-informed and critical public. In a more equitable democracy
                for all.
              </p>
              <p>
                People are hungry for a new way of engaging with politics, and
                we believe local is the place to start. Partisanship matters
                less when it's your backyard.
              </p>
              <p>Join us in making technology work for the people again.</p>
            </div>
          </div>

          <div id={styles["section1b"]}>
            <div id={styles["s1bcol1"]}>
              <div className={styles.contentwide}>
                <h1>Easy access to your government.</h1>
                <p>
                  Politicians, legislation, and organizations - connected and
                  networked to promote knowledge and action.
                </p>
                {/* <div
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Link href="register" passHref>
                    <button className="populist-button-1">Get Started</button>
                  </Link>
                </div> */}
              </div>
            </div>
            <div id={styles["s1bcol2"]}>
              <ImageWithFallback
                src={landing1}
                fallbackSrc={landing1fallback}
                alt="Politician browser on mobile"
                priority
              />
            </div>
          </div>

          <div id={styles["section2"]}>
            <div id={styles["s2col1"]}>
              <Image src={landing2} alt="desktop browser" />
            </div>
            <div id={styles["s2col2"]}>
              <div className={styles.contentwide}>
                <h1>Amplify your voice.</h1>
                <p>
                  Civic engagement starts with your vote. Extend its power
                  beyond the ballot box by letting your representatives know
                  your position on key legislation and issues.
                </p>
              </div>
            </div>
          </div>

          <div id={styles["section3"]}>
            <div id={styles["s3col1"]}>
              <div className={styles.contentwide}>
                <h1>Transparent, modern, and ethical.</h1>
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
                <h1>
                  Populist is for <span className={styles.emphasized}>voters</span>,{" "}
                  <span className={styles.emphasized}>organizations</span>, and{" "}
                  <span className={styles.emphasized}>politicians</span>.
                </h1>
                <p>
                  By creating and surfacing connections between these key
                  stakeholders, we can make meaningful action more accessible
                  and build a stronger democracy.
                </p>
              </div>
            </div>
            <div id={styles["s4row2"]}>
              <div className={classNames(styles.contentwide, styles.last)}>
                <h1 className={styles.botspace}>Interested? Sign up to learn more.</h1>

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
                          value="SUBMIT"
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
