import { useRouter } from "next/router";
import classnames from "classnames";
import useDeviceInfo from "hooks/useDeviceInfo";
import { Button } from "components";
import styles from "./AuthButtons.module.scss";
import { useAuth } from "hooks/useAuth";
import Link from "next/link";
import { PERSON_FALLBACK_IMAGE_URL } from "utils/constants";
import { Avatar } from "components";

function AuthButtons({
  showAvatarIfUser = false,
}: {
  showAvatarIfUser?: boolean;
}) {
  const user = useAuth({ redirect: false });
  const { isMobile } = useDeviceInfo();
  const { push } = useRouter();

  if (user && showAvatarIfUser) {
    return (
      <Link href="/settings/profile" passHref>
        <div>
          <Avatar
            src={
              user?.userProfile.profilePictureUrl || PERSON_FALLBACK_IMAGE_URL
            }
            alt="profile picture"
            size={35}
          />
        </div>
      </Link>
    );
  }

  return (
    <div className={styles.authButtons}>
      <div className={styles.menuContainer}>
        <ul className={styles.menu}>
          <li className={styles.menuButton}>
            <Button
              label="Register"
              size={isMobile ? "small" : "medium"}
              variant="primary"
              theme="blue"
              onClick={() => push(`/register`)}
            />
          </li>
          <li
            className={classnames(styles.menuButton, styles.showButtonOutline)}
          >
            <Button
              label="Sign In"
              size={isMobile ? "small" : "medium"}
              variant="secondary"
              theme="blue"
              onClick={() => push(`/login`)}
            />
          </li>
        </ul>
      </div>
    </div>
  );
}

export { AuthButtons };
