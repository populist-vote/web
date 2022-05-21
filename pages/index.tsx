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

// XXX: VERY SCARY THING THAT WE NEED TO FIX
const Home: NextPage = () => {
  return (
    <>
      <main>
        <div id="container1">
          <div id="section1">
            <div className="content">
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

          <div id="section1b">
            <div id="s1bcol1">
              <div className="contentwide">
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
            <div id="s1bcol2">
              <ImageWithFallback
                src={landing1}
                fallbackSrc={landing1fallback}
                alt="Politician browser on mobile"
                priority
              />
            </div>
          </div>

          <div id="section2">
            <div id="s2col1">
              <Image src={landing2} alt="desktop browser" />
            </div>
            <div id="s2col2">
              <div className="contentwide">
                <h1>Amplify your voice.</h1>
                <p>
                  Civic engagement starts with your vote. Extend its power
                  beyond the ballot box by letting your representatives know
                  your position on key legislation and issues.
                </p>
              </div>
            </div>
          </div>

          <div id="section3">
            <div id="s3col1">
              <div className="contentwide">
                <h1>Transparent, modern, and ethical.</h1>
                <p>
                  Moving fast and breaking things is no longer compatible with
                  our modern society. We lead with thoughtful design that is
                  responsible to people, not profits.
                </p>
              </div>
            </div>
            <div id="s3col2">
              <Image src={landing3} alt="transparency into our algorithms" />
            </div>
          </div>

          <div id="section4">
            <div id="s4row1">
              <div className="contentwide2">
                <Image
                  src={landing4}
                  alt="people becoming involved in government"
                />
                <h1>
                  Populist is for <span className="emphasized">voters</span>,{" "}
                  <span className="emphasized">organizations</span>, and{" "}
                  <span className="emphasized">politicians</span>.
                </h1>
                <p>
                  By creating and surfacing connections between these key
                  stakeholders, we can make meaningful action more accessible
                  and build a stronger democracy.
                </p>
              </div>
            </div>
            <div id="s4row2">
              <div className="contentwide last">
                <h1 className="botspace">Interested? Sign up to learn more.</h1>

                <div id="mc_embed_signup">
                  <form
                    action="https://populist.us2.list-manage.com/subscribe/post?u=f24fbd8a9a3cd91b78cb4a457&amp;id=361b16ea14"
                    method="post"
                    id="mc-embedded-subscribe-form"
                    name="mc-embedded-subscribe-form"
                    className="validate"
                    target="_blank"
                    noValidate
                  >
                    <div id="mc_embed_signup_scroll">
                      <input
                        type="email"
                        name="EMAIL"
                        className="email"
                        id="mce-EMAIL"
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
                      <div className="clear">
                        <input
                          type="submit"
                          value="SUBMIT"
                          name="subscribe"
                          id="mc-embedded-subscribe"
                          className="button"
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
