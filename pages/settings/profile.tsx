import { Avatar, Button, FlagSection, Layout } from "components";
import styles from "pages/settings/Profile.module.scss";
import { NextPageWithLayout } from "../_app";
import { useAuth } from "hooks/useAuth";
import { PERSON_FALLBACK_IMAGE_URL } from "utils/constants";

export const ProfilePage: NextPageWithLayout = () => {
  const user = useAuth({ redirectTo: "/login?next=settings/profile" });
  if (!user) return null;
  return (
    <FlagSection title="My Profile">
      <div className={styles.profile}>
        <section>
          <h2>Profile picture</h2>
          <div className={styles.avatarSection}>
            <Avatar
              src={PERSON_FALLBACK_IMAGE_URL}
              fallbackSrc={PERSON_FALLBACK_IMAGE_URL}
              alt="profile picture"
              size={100}
            />
            <Button
              id="upload-photo-btn"
              label={"Upload Photo"}
              variant="secondary"
              size="large"
              theme="blue"
            />
            <Button
              id="edit-thumbnail-btn"
              label={"Edit Thumbnail"}
              variant="secondary"
              size="large"
              theme="blue"
            />
          </div>
        </section>
        <section>
          <h2>Name</h2>
        </section>
        <section>
          <h2>Address</h2>
        </section>
        <section>
          <h2>Email</h2>
        </section>
        <section>
          <h2>Password</h2>
        </section>
        <section>
          <h2>Delete account</h2>
        </section>
      </div>
    </FlagSection>
  );
};

ProfilePage.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout mobileNavTitle="My Account">{page}</Layout>;
};

export default ProfilePage;
