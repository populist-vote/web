import clsx from "clsx";
import { Button, Layout, SEO } from "components";
import { useAuth } from "hooks/useAuth";
import Link from "next/link";
import { useRouter } from "next/router";
import styles from "./choose.module.scss";

function ChooseAdventure() {
  const user = useAuth({ redirect: false });
  const router = useRouter();
  if (user) void router.push("/ballot");
  return (
    <>
      <SEO
        title="Ballot"
        description="Find information on your government representatives like voting histories, endorsements, and financial data."
      />
      <Layout>
        <div className={styles.container}>
          <Link href={`/register?next=/ballot`} passHref>
            <div className={clsx(styles.roundedCard, styles.flex)}>
              <h2>View your Ballot</h2>
              <p>
                We’ll need your address where you’re registered to vote so we
                can localize your ballot information.
              </p>
              <Button
                label="Enter your address"
                size="large"
                variant="primary"
              />
            </div>
          </Link>
          <div className={styles.verticalDivider}>
            <div className={styles.centerElement}>OR</div>
          </div>
          <div className={clsx(styles.roundedCard, styles.flex)}>
            <h2>Browse by state</h2>
            <p>Browse elections and candidate information</p>
            <Link href="/politicians?state=CO" passHref>
              <div className={clsx(styles.stateButton, styles.aquaButton)}>
                Colorado
              </div>
            </Link>

            <Link href="/politicians?state=MN" passHref>
              <div className={clsx(styles.stateButton, styles.violetButton)}>
                Minnesota
              </div>
            </Link>
          </div>
        </div>
      </Layout>
    </>
  );
}

export default ChooseAdventure;
