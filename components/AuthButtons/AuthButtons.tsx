import { useRouter } from "next/router";
import useDeviceInfo from "hooks/useDeviceInfo";
import { Button } from "components";
import styles from "./AuthButtons.module.scss";
import { useAuth } from "hooks/useAuth";
import Link from "next/link";
import { PERSON_FALLBACK_IMAGE_URL } from "utils/constants";
import { Avatar } from "components";
import { useTranslation } from "next-i18next";

function AuthButtons({
  showAvatarIfUser = false,
}: {
  showAvatarIfUser?: boolean;
}) {
  const user = useAuth({ redirect: false });
  const { isMobile } = useDeviceInfo();
  const { push } = useRouter();
  const { t } = useTranslation("actions");

  if (user && showAvatarIfUser) {
    return (
      <Link href="/settings/profile" passHref>
        <div style={{ cursor: "pointer" }}>
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
    <ul className={styles.menu}>
      <li className={styles.menuButton}>
        <Button
          label={t("sign-in")}
          size={isMobile ? "small" : "medium"}
          variant="secondary"
          theme="blue"
          onClick={() => push(`/login`)}
        />
      </li>
      <li className={styles.menuButton}>
        <Button
          label={t("register")}
          size={isMobile ? "small" : "medium"}
          variant="primary"
          theme="blue"
          onClick={() => push(`/register`)}
        />
      </li>
    </ul>
  );
}

export { AuthButtons };
