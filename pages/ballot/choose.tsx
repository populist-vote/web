import classNames from "classnames";
import { Button, Layout } from "components";
import { useAuth } from "hooks/useAuth";
import Link from "next/link";
import { useRouter } from "next/router";
import styles from "./choose.module.scss";

function ChooseAdventure() {
  const user = useAuth({ redirect: false });
  const router = useRouter();
  if (user) void router.push("/ballot");
  return (
    <Layout>
      <div className={styles.container}>
        <Link href={`/register?next=/ballot`} passHref>
          <div className={classNames(styles.roundedCard, styles.flex)}>
            <h2>View your Ballot</h2>
            <p>
              We’ll need your address where you’re registered to vote so we can
              localize your ballot information.
            </p>
            <Button label="Enter your address" size="large" variant="primary" />
          </div>
        </Link>
        <div className={styles.verticalDivider}>
          <div className={styles.centerElement}>OR</div>
        </div>
        <div className={classNames(styles.roundedCard, styles.flex)}>
          <h2>Browse by state</h2>
          <p>Browse elections and candidate information</p>
          <Link href="/politicians?state=CO" passHref>
            <div className={classNames(styles.stateButton, styles.aquaButton)}>
              Colorado
            </div>
          </Link>

          <Link href="/politicians?state=MN" passHref>
            <div
              className={classNames(styles.stateButton, styles.violetButton)}
            >
              Minnesota
            </div>
          </Link>
        </div>
      </div>
    </Layout>
  );
}

export default ChooseAdventure;
