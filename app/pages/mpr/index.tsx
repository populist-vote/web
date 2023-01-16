import { useState, useEffect } from "react";

import {
  Layout,
  MPRLogo,
  LoaderFlag,
  RaceSection,
  Button,
  TextInput,
} from "components";
import { useMprFeaturedRacesQuery, RaceResult } from "generated";
import styles from "./MPRElectionPage.module.scss";
import { splitRaces } from "utils/data";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import nextI18NextConfig from "../../next-i18next.config";
import { SupportedLocale } from "global";
import { OrganizationAvatar } from "components/Avatar/Avatar";

export async function getServerSideProps({
  locale,
}: {
  locale: SupportedLocale;
}) {
  return {
    props: {
      title: "MPR News | Minnesota 2022 Election",
      description:
        "Find information on your government representatives like voting histories, endorsements, and financial data.",
      ...(await serverSideTranslations(
        locale,
        ["common", "auth"],
        nextI18NextConfig
      )),
    },
  };
}

function MPRElectionPage() {
  const { data, isLoading, isError } = useMprFeaturedRacesQuery();

  const [races, setRaces] = useState<ReturnType<typeof splitRaces>>();

  useEffect(() => {
    if (!isLoading && data?.races) {
      setRaces(splitRaces(data.races as RaceResult[]));
    }
  }, [isLoading, data, setRaces]);

  const { register, handleSubmit, formState } = useForm<{
    phone: string;
  }>({
    mode: "onChange",
  });

  const { isValid, isSubmitting } = formState;

  const handleSmsSubscribe = async (phone: string) => {
    try {
      const res = await fetch(
        `https://app.groundsource.co/surveys/sms/textsms/?MessageSid=1&To=%2B18554600137&From=%2B${phone.replaceAll(
          "-",
          ""
        )}&Body=2022election&ant=false`,
        {
          method: "GET",
        }
      );

      if (res.status === 200) {
        toast(
          "You have successfully subscribed to election updates from MPR!",
          {
            type: "success",
            position: "bottom-center",
          }
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const onSubscribe = ({ phone }: { phone: string }) =>
    handleSmsSubscribe(phone);

  if (isError)
    return (
      <Layout>
        <h1>Error</h1>
        <h2>Please reload</h2>
      </Layout>
    );

  return (
    <Layout>
      <div className={styles.mprHeader}>
        <h1 className={styles.mprLogo}>
          <MPRLogo height={80} />
        </h1>
        <h1 className={styles.subHeading}>
          Build Your 2022 MN Election Ballot
        </h1>
        <h4 className={styles.racesHeading}>Highlighted Races</h4>

        <p>
          MPR News has highlighted some of the important races happening in
          Minnesota this election - check out the candidates below, then view
          what's on your ballot and create your own personalized voting guide to
          share with others.
        </p>
        <p className={styles.cta1}>
          <Link href="/ballot" passHref>
            <Button
              variant="primary"
              size="large"
              label="View your ballot"
            ></Button>
          </Link>
        </p>
        <p>
          Got more questions about the election?{" "}
          <a
            href="https://www.mprnews.org/election-2022-questions-stories"
            target="_blank"
            rel="noopener noreferrer"
          >
            Share them with us
          </a>
          , and stay informed on the latest news about who is running and what
          Minnesotans are looking for in our daily{" "}
          <a
            href="https://www.mprnews.org/capitol-view-newsletter"
            target="_blank"
            rel="noopener noreferrer"
          >
            Capitol View newsletter.
          </a>
        </p>
        <p>
          <span className={styles.bold}>
            Be sure to check out MPR's Voting guides for these key races.
          </span>
        </p>
        <p className={styles.cta2}>
          <Link href="/organizations/mpr-news" passHref>
            <Button
              variant="primary"
              size="large"
              label="Voting Guides"
              icon={
                <OrganizationAvatar
                  src="https://populist-platform.s3.us-east-2.amazonaws.com/web-assets/organization-thumbnails/mpr-news-160.jpg"
                  alt="MPR"
                  size={60}
                />
              }
              iconPosition="before"
              style={{
                padding: "0.5rem 1.5rem 0.5rem 0.5rem",
                borderRadius: "100px",
              }}
            ></Button>
          </Link>
        </p>
      </div>

      {isLoading ? (
        <LoaderFlag />
      ) : (
        <>
          {races?.state && (
            <RaceSection races={races.state} color="yellow" label="State" />
          )}
          <div className={styles.mprBody}>
            <p>
              Voting ended on November 8—if you aren’t registered to vote, you
              can{" "}
              <a
                href="https://mnvotes.sos.state.mn.us/VoterRegistration/VoterRegistrationMain.aspx"
                target="_blank"
                rel="noopener noreferrer"
              >
                register online{" "}
              </a>
              to participate in the next election.
            </p>
          </div>
          {races?.federal && (
            <RaceSection races={races.federal} color="aqua" label="Federal" />
          )}
          <section className={styles.smsSection}>
            <h2>Sign up for SMS election results</h2>
            <p>
              Get midterm election results from MPR sent directly to your phone
              via text message.
            </p>
            <form
              onSubmit={handleSubmit(onSubscribe)}
              className={styles.smsForm}
            >
              <TextInput
                name="phone"
                type="tel"
                placeholder="Enter your phone number"
                register={register}
                rules={{
                  required: true,
                  minLength: 6,
                  maxLength: 12,
                  pattern:
                    /^[(]{0,1}[0-9]{3,5}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{2,4}$/,
                }}
              />
              <Button
                variant="primary"
                size="large"
                label={isSubmitting ? "Loading" : "Subscribe"}
                disabled={isSubmitting || !isValid}
                style={{ minWidth: "14rem" }}
              />
            </form>
            <p>
              <span className={styles.smallText}>
                Text STOP to quit receiving messages at any time. Standard
                message rates apply.
              </span>
            </p>
          </section>
        </>
      )}
    </Layout>
  );
}

export default MPRElectionPage;
