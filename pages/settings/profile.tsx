import { useForm } from "react-hook-form";
import Router, { useRouter } from "next/router";
import { ChangeEvent, useState } from "react";
import {
  Avatar,
  Button,
  FlagSection,
  Layout,
  LoaderFlag,
  TextInput,
} from "components";
import profileStyles from "pages/settings/Profile.module.scss";
import { NextPageWithLayout } from "../_app";
import { useAuth } from "hooks/useAuth";
import { PERSON_FALLBACK_IMAGE_URL } from "utils/constants";
import {
  AddressResult,
  useUpdateFirstAndLastNameMutation,
  useUpdateAddressMutation,
  useUpdatePasswordMutation,
  useUpdateEmailMutation,
  useLogoutMutation,
  useValidatePasswordEntropyQuery,
  useUserProfileQuery,
  useUpdateUsernameMutation,
  useDeleteAccountMutation,
} from "generated";
import { PasswordEntropyMeter } from "components/Auth/Register/PasswordEntropyMeter/PasswordEntropyMeter";
import states from "utils/states";

type NameSectionProps = {
  firstName: string;
  lastName: string;
};

const NameSection = ({ firstName, lastName }: NameSectionProps) => {
  const { register, handleSubmit, formState, reset } =
    useForm<NameSectionProps>({
      mode: "onChange",
      defaultValues: {
        firstName,
        lastName,
      },
    });
  const updateNameMutation = useUpdateFirstAndLastNameMutation({
    onSuccess: ({ updateFirstAndLastName }) => {
      reset(updateFirstAndLastName as NameSectionProps);
    },
  });
  const { isValid, isDirty } = formState;
  const onSubmit = ({
    firstName,
    lastName,
  }: {
    firstName: string;
    lastName: string;
  }) => {
    updateNameMutation.mutate({
      firstName,
      lastName,
    });
  };

  return (
    <section>
      <h2>Name</h2>
      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={profileStyles.nameSection}>
            <TextInput
              name="firstName"
              id="first-name"
              label="First Name"
              placeholder={"First name"}
              hideLabel
              register={register}
            />

            <TextInput
              name="lastName"
              id="last-name"
              label="Last Name"
              placeholder={"Last name"}
              hideLabel
              register={register}
            />
          </div>
          <Button
            disabled={!isDirty || !isValid}
            variant="secondary"
            size="large"
            theme="blue"
            label="Save"
            type="submit"
          />
        </form>
      </div>
    </section>
  );
};

const UsernameSection = ({ username }: { username: string }) => {
  const { register, handleSubmit, formState, reset } = useForm<{
    username: string;
  }>({
    mode: "onChange",
    defaultValues: {
      username,
    },
  });
  const updateUsernameMutation = useUpdateUsernameMutation({
    onSuccess: ({ updateUsername }) => {
      reset(updateUsername);
    },
  });
  const { errors, isValid, isDirty } = formState;
  const onSubmit = ({ username }: { username: string }) => {
    updateUsernameMutation.mutate({
      username,
    });
  };

  // Need to handle username already taken here

  return (
    <section>
      <h2>Username</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <TextInput
            id="username"
            name="username"
            label="Username"
            placeholder={"Username"}
            hideLabel
            errors={errors.username?.message}
            register={register}
            rules={{
              required: "Username is required",
            }}
          />
          <Button
            disabled={!isDirty || !isValid}
            variant="secondary"
            size="large"
            theme="blue"
            label="Save"
            type="submit"
          />
        </div>
      </form>
    </section>
  );
};

const EmailSection = ({ email }: { email: string }) => {
  const { register, handleSubmit, formState, reset } = useForm<{
    email: string;
  }>({
    mode: "onChange",
    defaultValues: {
      email,
    },
  });
  const updateEmailMutation = useUpdateEmailMutation({
    onSuccess: ({ updateEmail }: { updateEmail: { email: string } }) => {
      reset(updateEmail);
    },
  });
  const { errors, isValid, isDirty } = formState;
  const onSubmit = ({ email }: { email: string }) => {
    updateEmailMutation.mutate({
      email,
    });
  };
  return (
    <section>
      <h2>Email</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <TextInput
            id="email"
            name="email"
            label="Email"
            placeholder={"Email"}
            hideLabel
            errors={errors.email?.message}
            register={register}
            rules={{
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            }}
          />
          <Button
            disabled={!isDirty || !isValid}
            variant="secondary"
            size="large"
            theme="blue"
            label="Save"
            type="submit"
          />
        </div>
      </form>
    </section>
  );
};

const AddressSection = ({ address }: { address: AddressResult }) => {
  const { register, handleSubmit, formState, reset } = useForm<AddressResult>({
    mode: "onChange",
    defaultValues: address,
  });
  const updateAddressMutation = useUpdateAddressMutation({
    onSuccess: ({ updateAddress }) => {
      reset(updateAddress);
    },
  });
  const { errors, isValid, isDirty } = formState;
  const onSubmit = (address: AddressResult) => {
    updateAddressMutation.mutate({
      address: {
        ...address,
        country: "USA",
      },
    });
  };

  return (
    <section>
      <h2>Address</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={profileStyles.addressSection}>
          <span>
            Enter the address where you’re registered to vote - that’s the only
            thing we save, so we can serve you relevant local government
            information.
          </span>

          <TextInput
            name="line1"
            errors={errors.line1?.message}
            id="address-street"
            label="Street Address"
            placeholder={"Street address"}
            hideLabel
            register={register}
            rules={{ required: "Address line 1 is required" }}
          />

          <TextInput
            name="line2"
            errors={errors.line2?.message}
            id="address-line-2"
            label="Apartment, unit, suite, floor #, etc."
            placeholder={"Apartment, unit, suite, floor #, etc."}
            hideLabel
            register={register}
          />
          <div className={profileStyles.location}>
            <TextInput
              name="city"
              errors={errors.city?.message}
              id="address-city"
              label="City"
              placeholder={"City"}
              hideLabel
              register={register}
              rules={{ required: "City is required" }}
            />

            <div>
              <select
                id="states"
                required
                {...register("state", {
                  required: "State is required",
                })}
              >
                <option value="">State</option>
                {Object.entries(states).map(([key, value]) => (
                  <option key={key} value={key} label={value}>
                    {value}
                  </option>
                ))}
              </select>
              {errors.state?.message && (
                <span className={profileStyles.errorMessage}>
                  {errors.state.message}
                </span>
              )}
            </div>

            <TextInput
              name="postalCode"
              errors={errors.postalCode?.message}
              id="address-zip"
              label="Zip code"
              placeholder={"Zip code"}
              hideLabel
              register={register}
              rules={{
                required: "Zip code is required",
                pattern: /^[0-9]{5}$/,
              }}
            />
          </div>
          <Button
            disabled={!isDirty || !isValid}
            variant="secondary"
            size="large"
            theme="blue"
            label="Save"
            type="submit"
          />
        </div>
      </form>
    </section>
  );
};

const SignOutSection = () => {
  const router = useRouter();
  const logOutMutation = useLogoutMutation({
    onSuccess: () => router.push("/login"),
  });
  const handleSignOut = () => {
    logOutMutation.mutate({});
  };
  return (
    <section>
      <h2>Sign out</h2>
      <div className={profileStyles.signOutSection}>
        <Button
          variant="secondary"
          size="large"
          theme="blue"
          label="Sign out"
          onClick={handleSignOut}
        />
      </div>
    </section>
  );
};

const DeleteAccountSection = () => {
  const [deleteConfirmationChecked, setDeleteConfirmationChecked] =
    useState<boolean>(false);

  const deleteAccountMutation = useDeleteAccountMutation({
    onSuccess: () => Router.push("/register"),
  });

  const handleDeleteConfirmation = (e: ChangeEvent<HTMLInputElement>) => {
    setDeleteConfirmationChecked(e.target.checked);
  };

  const handleDeleteAccount = () => {
    deleteAccountMutation.mutate({});
  };

  return (
    <section>
      <h2>Delete account</h2>
      <div className={profileStyles.deleteSection}>
        <span>
          All of your data will be deleted and can never be recovered.
        </span>
        <div className={profileStyles.deleteConfirmation}>
          <input
            type="checkbox"
            id="delete-confirmation"
            onChange={handleDeleteConfirmation}
          />
          <label htmlFor="delete-confirmation">
            Are you sure you want to completely delete your account?
          </label>
        </div>
        <Button
          variant="secondary"
          size="large"
          theme="blue"
          label="Delete"
          disabled={!deleteConfirmationChecked}
          onClick={handleDeleteAccount}
        />
      </div>
    </section>
  );
};

const PasswordSection = () => {
  const { register, handleSubmit, formState, getValues, reset, setError } =
    useForm<{
      oldPassword: string;
      newPassword: string;
      newPasswordConfirmation: string;
    }>({
      mode: "onChange",
      defaultValues: {
        oldPassword: "",
        newPassword: "",
        newPasswordConfirmation: "",
      },
    });
  const {
    data: passwordEntropyData = {
      validatePasswordEntropy: {
        valid: false,
        score: 0,
        message: null,
      },
    },
    isLoading: isEntropyCalcLoading,
  } = useValidatePasswordEntropyQuery(
    {
      password: getValues("newPassword"),
    },
    {
      refetchOnWindowFocus: false,
      enabled: getValues("newPassword").length > 0,
    }
  );

  const {
    valid: isPasswordValid,
    score,
    message,
  } = passwordEntropyData?.validatePasswordEntropy ?? {};

  const updatePasswordMutation = useUpdatePasswordMutation({
    onSuccess: () => {
      reset({
        oldPassword: "",
        newPassword: "",
        newPasswordConfirmation: "",
      });
    },
    onError: (error) => {
      if (error instanceof Error)
        setError("oldPassword", { message: error.message });
    },
  });
  const { errors, isValid, isDirty } = formState;
  const onSubmit = ({
    oldPassword,
    newPassword,
  }: {
    oldPassword: string;
    newPassword: string;
    newPasswordConfirmation: string;
  }) => {
    updatePasswordMutation.mutate({
      oldPassword,
      newPassword,
    });
  };
  return (
    <section>
      <h2>Password</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={profileStyles.passwordSection}>
          <TextInput
            name="oldPassword"
            errors={errors.oldPassword?.message}
            type="password"
            id="current-password"
            label="Old password"
            placeholder={"Old password"}
            hideLabel
            register={register}
            rules={{
              validate: (value: string) =>
                getValues("newPassword").length === 0 ||
                value.length > 0 ||
                "Current password is required",
            }}
          />
          <TextInput
            name="newPassword"
            errors={errors.newPassword?.message}
            type="password"
            id="new-password"
            label="New password"
            placeholder={"New password"}
            hideLabel
            register={register}
            rules={{
              validate: () => isPasswordValid,
            }}
          />
          <TextInput
            name="newPasswordConfirmation"
            errors={errors.newPasswordConfirmation?.message}
            type="password"
            id="confirm-password"
            label="Confirm password"
            placeholder={"Confirm password"}
            hideLabel
            register={register}
            rules={{
              required: "Password confirmation is required",
              validate: (value: string) =>
                value === getValues("newPassword") || "Passwords do not match",
            }}
          />
          {getValues("newPassword").length > 0 && (
            <PasswordEntropyMeter
              valid={isPasswordValid}
              score={score}
              message={message}
              length={getValues("newPassword").length}
              isLoading={isEntropyCalcLoading}
            />
          )}
          <Button
            disabled={!isDirty || !isValid}
            variant="secondary"
            size="large"
            theme="blue"
            label="Save"
            type="submit"
          />
        </div>
      </form>
    </section>
  );
};

const ProfilePhotoSection = () => {
  return (
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
  );
};

export const ProfilePage: NextPageWithLayout = () => {
  const user = useAuth({ redirectTo: "/login?next=settings/profile" });
  const { data: { userProfile } = {}, isLoading } = useUserProfileQuery(
    {
      userId: user?.id,
    },
    {
      enabled: !!user?.id,
    }
  );
  if (isLoading) return <LoaderFlag />;
  if (!userProfile) return null;
  const {
    address = {},
    firstName = "",
    lastName = "",
    email,
    username,
  } = userProfile;

  return (
    <FlagSection hideFlagForMobile title="My Profile">
      <div className={profileStyles.profile}>
        {false && <ProfilePhotoSection />}
        <NameSection
          firstName={firstName as string}
          lastName={lastName as string}
        />
        <UsernameSection username={username as string} />
        <AddressSection address={address as AddressResult} />
        <EmailSection email={email} />
        <PasswordSection />
        <SignOutSection />
        <DeleteAccountSection />
      </div>
    </FlagSection>
  );
};

ProfilePage.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout mobileNavTitle="My Account">{page}</Layout>;
};

export default ProfilePage;
