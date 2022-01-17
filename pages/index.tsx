/* eslint-disable react/no-unescaped-entities */
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import headerLogo from '../public/images/PopulistLogo.svg'
import landing1 from '../public/images/landing/politicianBrowser.gif'
import landing2 from '../public/images/landing/amplify.png'
import landing3 from '../public/images/landing/3.png'
import landing4 from '../public/images/landing/Connections.png'

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Populist</title>
        <meta
          name="description"
          content="Non partisan politics for the people"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <body>
        <div id="container1">
          <div id="menu">
            <ul className="nav">
              {/* <li><span className="button">COLORADO BALLOT MEASURES</span></li> */}
            </ul>
          </div>

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
              </div>
            </div>
            <div id="s1bcol2">
              <a href="ballot/">
                <Image src={landing1} alt="Politician browser on mobile" />
              </a>
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
                  Civic engagement starts with your vote. Extend it's power
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
              <div className="contentwide">
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
                <p>Sign up for updates.</p>

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
                        value=""
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
                          value=""
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

            <footer id="footer">
              <p>
                <a
                  href="https://www.facebook.com/populist.us"
                  rel="noreferrer"
                  target="_blank"
                >
                  <i className="fab fa-facebook"></i>
                </a>
                <a
                  href="https://twitter.com/populist_us"
                  rel="noreferrer"
                  target="_blank"
                >
                  <i className="fab fa-twitter"></i>
                </a>
                <a
                  href="https://www.instagram.com/populist.us/"
                  rel="noreferrer"
                  target="_blank"
                >
                  <i className="fab fa-instagram"></i>
                </a>
              </p>
              <p id="copyright">
                &#169; {new Date().getFullYear()} Populist. &nbsp;Made in
                Colorado.
              </p>
            </footer>
          </div>
        </div>
      </body>
    </>
  );
}

export default Home
