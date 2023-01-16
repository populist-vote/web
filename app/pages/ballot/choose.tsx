import clsx from "clsx";
import { Button, Layout } from "components";
import { useAuth } from "hooks/useAuth";
import nextI18nextConfig from "next-i18next.config";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Link from "next/link";
import { useRouter } from "next/router";
import { SupportedLocale } from "global";
import styles from "./choose.module.scss";

export async function getServerSideProps({
  locale,
}: {
  locale: SupportedLocale;
}) {
  return {
    props: {
      title: "Ballot",
      description:
        "Find information on your government representatives like voting histories, endorsements, and financial data.",
      ...(await serverSideTranslations(
        locale,
        ["auth", "common"],
        nextI18nextConfig
      )),
    },
  };
}

function ChooseAdventure() {
  const user = useAuth({ redirect: false });
  const router = useRouter();
  if (user) void router.push("/ballot");
  return (
    <Layout>
      <div className={styles.container}>
        <Link href={`/register?next=/ballot`} passHref>
          <div className={clsx(styles.roundedCard, styles.flex)}>
            <h2>View your Ballot</h2>
            <p>
              We’ll need your address where you’re registered to vote so we can
              localize your ballot information.
            </p>
            <Button label="Enter your address" size="large" variant="primary" />
          </div>
        </Link>
        <div className={styles.divider}>
          <div className={styles.centerElement}>OR</div>
        </div>
        <div className={clsx(styles.roundedCard, styles.flex)}>
          <h2>Browse by state</h2>
          <p>Browse elections and candidate information</p>
          <Link
            href="/politicians?state=CO"
            passHref
            className={clsx(styles.stateButton, styles.aquaButton)}
          >
            Colorado
          </Link>

          <Link
            href="/politicians?state=MN"
            className={clsx(styles.stateButton, styles.violetButton)}
          >
            Minnesota
          </Link>
        </div>
      </div>
    </Layout>
  );
}

export default ChooseAdventure;
