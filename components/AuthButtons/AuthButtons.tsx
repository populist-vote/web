import { useRouter } from "next/router";
import classnames from "classnames";
import useDeviceInfo from "hooks/useDeviceInfo";
import { Button } from "components";
import styles from "./AuthButtons.module.scss";

function AuthButtons() {
  const { isMobile } = useDeviceInfo();
  const { push } = useRouter();
  return (
    <div className={styles.authButtons}>
      <div className={styles.menuContainer}>
        <ul className={styles.menu}>
          <li className={styles.menuButton}>
            <Button
              label="Sign In"
              size={isMobile ? "small" : "medium"}
              variant="primary"
              theme="blue"
              onClick={() => push(`/login`)}
            />
          </li>
          <li
            className={classnames(styles.menuButton, styles.showButtonOutline)}
          >
            <Button
              label="Register"
              size={isMobile ? "small" : "medium"}
              variant="secondary"
              theme="blue"
              onClick={() => push(`/register`)}
            />
          </li>
        </ul>
      </div>
    </div>
  );
}

export { AuthButtons };
