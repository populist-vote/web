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
import { useAuth } from "hooks/useAuth";
import { PERSON_FALLBACK_IMAGE_URL } from "utils/constants";
import styles from "../../components/TextInput/TextInput.module.scss";
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
  useCurrentUserQuery,
  useDeleteProfilePictureMutation,
} from "generated";
import { PasswordEntropyMeter } from "components";
import states from "utils/states";
import { useQueryClient } from "react-query";
import { useDropzone, FileWithPath } from "react-dropzone";
import { toast } from "react-toastify";
import { PasswordInput } from "components/Auth/PasswordInput";
import useDebounce from "hooks/useDebounce";
import { NextPage } from "next";
import { SupportedLocale } from "types/global";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import nextI18nextConfig from "next-i18next.config";

type NameSectionProps = {
  firstName: string;
  lastName: string;
};

const NameSection = ({ firstName, lastName }: NameSectionProps) => {
  const queryClient = useQueryClient();
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
      queryClient
        .invalidateQueries(useCurrentUserQuery.getKey())
        .catch((err) => console.error(err));
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
  const queryClient = useQueryClient();
  const { register, handleSubmit, formState, reset, setError } = useForm<{
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
      void queryClient.invalidateQueries(useCurrentUserQuery.getKey());
    },
    onError: (error) => {
      if (error instanceof Error)
        setError("username", { message: error.message });
    },
  });
  const { errors, isValid, isDirty } = formState;
  const onSubmit = ({ username }: { username: string }) => {
    updateUsernameMutation.mutate({
      username,
    });
  };

  // 3-20 characters, no spaces, no special characters besides _ and ., no _ or . at the end
  const usernameRegex = /^[a-zA-Z0-9_.]{3,20}$/;

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
              pattern: usernameRegex,
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
  const { register, handleSubmit, formState, reset, setError } = useForm<{
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
    onError: (error) => {
      if (error instanceof Error) setError("email", { message: error.message });
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
  const queryClient = useQueryClient();
  const { register, handleSubmit, formState, reset, setError } =
    useForm<AddressResult>({
      mode: "onChange",
      defaultValues: address,
    });
  const updateAddressMutation = useUpdateAddressMutation({
    onSuccess: ({ updateAddress }) => {
      reset(updateAddress);
      queryClient
        .resetQueries(["ElectionById", useCurrentUserQuery.getKey()])
        .catch((err) => console.error(err));
      void toast.success("Address updated successfully");
    },
    onError: (error) => {
      if (error instanceof Error) setError("line1", { message: error.message });
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

            <div className={styles.inputContainer}>
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

  const debouncedPassword = useDebounce(getValues("newPassword"), 500);

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
      password: debouncedPassword,
    },
    {
      refetchOnWindowFocus: false,
      enabled: debouncedPassword.length > 0,
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
          <PasswordInput
            name="oldPassword"
            errors={errors.oldPassword?.message}
            id="current-password"
            label="Old password"
            placeholder={"Old password"}
            autoComplete="current-password"
            hideLabel
            register={register}
            rules={{
              validate: (value: string) =>
                getValues("newPassword").length === 0 ||
                value.length > 0 ||
                "Current password is required",
            }}
          />
          <PasswordInput
            name="newPassword"
            errors={errors.newPassword?.message}
            id="new-password"
            label="New password"
            placeholder={"New password"}
            autoComplete="new-password"
            hideLabel
            register={register}
            rules={{
              validate: () => isPasswordValid,
            }}
          />
          <PasswordInput
            name="newPasswordConfirmation"
            errors={errors.newPasswordConfirmation?.message}
            id="confirm-password"
            label="Confirm password"
            placeholder={"Confirm password"}
            autoComplete="new-password"
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

const ProfilePhotoSection = ({
  profilePictureUrl,
  userId,
}: {
  profilePictureUrl: string;
  userId: string;
}) => {
  const [uploading, setUploading] = useState<boolean>(false);
  const queryClient = useQueryClient();

  const onDropAccepted = (files: FileWithPath[]) => {
    setUploading(true);
    const formData = new FormData();
    const uploadProfilePictureOperations = `
      {
        "query":"mutation UploadProfilePicture($file: Upload) {uploadProfilePicture(file: $file) }",
        "variables":{
            "file":null
        }
      }
      `;

    formData.append("operations", uploadProfilePictureOperations);
    const map = `{"file": ["variables.file"]}`;
    formData.append("map", map);
    if (files[0]) formData.append("file", files[0]);

    fetch(`${process.env.GRAPHQL_SCHEMA_PATH}`, {
      method: "POST",
      body: formData,
      credentials: "include",
    })
      .then(() => {
        queryClient
          .invalidateQueries(useUserProfileQuery.getKey({ userId }))
          .catch((err) => console.error(err));
      })
      .catch((error) => console.error(error))
      .finally(() => setUploading(false));
  };

  const onDropRejected = () =>
    toast(`Please try a file under 2MB`, {
      type: "error",
      position: "bottom-center",
    });

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDropAccepted,
    onDropRejected,
    multiple: false,
    maxSize: 2 * 1024 * 1024,
  });

  const label = isDragActive
    ? "Drop image here"
    : !profilePictureUrl
    ? "Upload profile picture"
    : "Change profile picture";

  const deleteProfilePictureMutation = useDeleteProfilePictureMutation({
    onSuccess: () => {
      queryClient
        .invalidateQueries(useUserProfileQuery.getKey({ userId }))
        .catch((err) => console.error(err));
    },
  });

  const handleDeleteProfilePicture = () => {
    deleteProfilePictureMutation.mutate({});
  };

  return (
    <section>
      <h2>Profile picture</h2>
      <div className={profileStyles.avatarSection}>
        {uploading ? (
          <LoaderFlag />
        ) : (
          <Avatar
            key={profilePictureUrl}
            src={profilePictureUrl}
            fallbackSrc={PERSON_FALLBACK_IMAGE_URL}
            alt="profile picture"
            size={200}
          />
        )}
        <div {...getRootProps()}>
          <input {...getInputProps()} />
          <Button variant="secondary" size="large" theme="blue" label={label} />
        </div>
        <div>
          {profilePictureUrl && (
            <Button
              variant="secondary"
              size="large"
              theme="red"
              label={"Remove profile picture"}
              onClick={handleDeleteProfilePicture}
              disabled={deleteProfilePictureMutation.isLoading}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export const ProfilePage: NextPage = () => {
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
    profilePictureUrl,
  } = userProfile;

  return (
    <Layout mobileNavTitle="My Account">
      <FlagSection hideFlagForMobile title="My Profile">
        <div className={profileStyles.profile}>
          <ProfilePhotoSection
            profilePictureUrl={profilePictureUrl as string}
            userId={user.id}
          />
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
    </Layout>
  );
};

export default ProfilePage;

export async function getServerSideProps({
  locale,
}: {
  locale: SupportedLocale;
}) {
  return {
    props: {
      title: "Profile",
      ...(await serverSideTranslations(
        locale as SupportedLocale,
        ["actions"],
        nextI18nextConfig
      )),
    },
  };
}
