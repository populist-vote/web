import { Avatar, Button, FlagSection, Layout, TextInput } from "components";
import profileStyles from "pages/settings/Profile.module.scss";
import { NextPageWithLayout } from "../_app";
import { useAuth } from "hooks/useAuth";
import { PERSON_FALLBACK_IMAGE_URL } from "utils/constants";

export const ProfilePage: NextPageWithLayout = () => {
  const user = useAuth({ redirectTo: "/login?next=settings/profile" });
  if (!user) return null;
  const [firstName = "", lastName = ""] = user.username.split(" ");
  return (
    <FlagSection hideFlagForMobile title="My Profile">
      <div className={profileStyles.profile}>
        <section>
          <h2>Profile picture</h2>
          <div className={profileStyles.avatarSection}>
            <Avatar
              src={PERSON_FALLBACK_IMAGE_URL}
              fallbackSrc={PERSON_FALLBACK_IMAGE_URL}
              alt="profile picture"
              size={200}
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
          <div>
            <div className={profileStyles.nameSection}>
              <TextInput id="first-name" value={firstName} label="First Name" placeholder={"First name"} hideLabel />
              <TextInput id="last-name" value={lastName} label="Last Name" placeholder={"Last name"} hideLabel />
            </div>
            <Button variant="secondary" size="large" theme="blue" label="Save" />
          </div>
        </section>
        <section>
          <h2>Address</h2>
          <div className={profileStyles.addressSection}>
            <span>
              Enter the address where you’re registered to vote - that’s the only thing we save, so we can serve you relevant local government information.
            </span>
            <TextInput id="address-street" label="Street Address" placeholder={"Street address"} hideLabel />
            <TextInput id="address-line-2" label="Apartment, unit, suite, floor #, etc." placeholder={"Apartment, unit, suite, floor #, etc."} hideLabel />
            <div className={profileStyles.location}>
              <TextInput id="address-city" label="City" placeholder={"City"} hideLabel />
              <TextInput id="address-state" label="State" placeholder={"State"} hideLabel />
              <TextInput id="address-zip" label="Zip code" placeholder={"Zip code"} hideLabel />
            </div>
            <Button variant="secondary" size="large" theme="blue" label="Save" />
          </div>
        </section>
        <section>
          <h2>Email</h2>
          <div>
            <TextInput id="email" value={user.email} label="Email" placeholder={"Email"} hideLabel />
            <Button variant="secondary" size="large" theme="blue" label="Save" />
          </div>
        </section>
        <section>
          <h2>Password</h2>
          <div className={profileStyles.passwordSection}>
            <TextInput id="current-password" label="Old password" placeholder={"Old password"} hideLabel />
            <TextInput id="new-password" label="New password" placeholder={"New password"} hideLabel />
            <TextInput id="confirm-password" label="Confirm password" placeholder={"Confirm password"} hideLabel />
            <Button variant="secondary" size="large" theme="blue" label="Save" />
          </div>
        </section>
        <section>
          <h2>Sign out</h2>
          <div className={profileStyles.signOutSection}>
            <Button variant="secondary" size="large" theme="blue" label="Sign out" />
          </div>
        </section>
        <section>
          <h2>Delete account</h2>
          <div className={profileStyles.deleteSection}>
            <span>All of your data will be deleted and can never be recovered.</span>
            <div className={profileStyles.deleteConfirmation}>
              <input type="checkbox" id="delete-confirmation" />
              <label htmlFor="delete-confirmation">Are you sure you want to completely delete your account?</label>
            </div>
            <Button variant="secondary" size="large" theme="blue" label="Delete" disabled />
          </div>
        </section>
      </div>
    </FlagSection>
  );
};

ProfilePage.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout mobileNavTitle="My Account">{page}</Layout>;
};

export default ProfilePage;
