import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/router";
import { useState } from "react";
import { Avatar, Button, FlagSection, Layout, TextInput } from "components";
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
} from "generated";
import { PasswordEntropyMeter } from "components/Auth/Register/PasswordEntropyMeter/PasswordEntropyMeter";
import states from "utils/states";

const NameSection = ({ firstName, lastName }: { firstName: string, lastName: string }) => {
  const { control, handleSubmit, formState, reset } = useForm<{ firstName: string, lastName: string }>({
    mode: "onChange",
    defaultValues: {
      firstName, lastName
    }
  });
  const updateNameMutation = useUpdateFirstAndLastNameMutation({
    onSuccess: ({ updateFirstAndLastName }) => {
      reset(updateFirstAndLastName);
    }
  });
  const { isValid, isDirty } = formState;
  const onSubmit = ({
    firstName,
    lastName
  }: {
    firstName: string,
    lastName: string
  }) => {
    updateNameMutation.mutate({
      firstName, lastName
    });
  };
   
  return (
    <section>
      <h2>Name</h2>
      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={profileStyles.nameSection}>
            <Controller
              name="firstName"
              control={control}
              render={({ field: { ref, ...other } }) => {
                return (
                  <TextInput ref={ref} id="first-name" label="First Name" placeholder={"First name"} hideLabel {...other} />
                );
              }}
            />
            <Controller
              name="lastName"
              control={control}
              render={({ field: { ref, ...other } }) => {
                return (
                  <TextInput ref={ref} id="last-name" label="Last Name" placeholder={"Last name"} hideLabel {...other} />
                );
              }}
            />
          </div>
          <Button disabled={!isDirty || !isValid} variant="secondary" size="large" theme="blue" label="Save" type="submit" />
        </form>
      </div>
    </section>
  );
};

const EmailSection = ({ email }: { email: string }) => {
  const { control, handleSubmit, formState, reset } = useForm<{ email: string }>({
    mode: "onChange",
    defaultValues: {
      email
    }
  });
  const updateEmailMutation = useUpdateEmailMutation({
    onSuccess: ({ updateEmail }) => {
      reset(updateEmail);
    }
  });
  const { errors, isValid, isDirty } = formState;
  const onSubmit = ({
    email
  }: {
    email: string
  }) => {
    updateEmailMutation.mutate({
      email
    });
  };
  return (
    <section>
      <h2>Email</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <Controller
            name="email"
            control={control}
            render={({ field: { ref, ...other } }) => {
              return (
                <TextInput ref={ref} errors={errors.email?.message} id="email" label="Email" placeholder={"Email"} hideLabel {...other} />
              );
            }}
          />
          <Button disabled={!isDirty || !isValid} variant="secondary" size="large" theme="blue" label="Save" type="submit" />
        </div>
      </form>
    </section>
  );
};

const AddressSection = ({ address }: { address: AddressResult }) => {
  const { register, control, handleSubmit, formState, reset } = useForm<AddressResult>({
    mode: "onChange",
    defaultValues: address
  });
  const updateAddressMutation = useUpdateAddressMutation({
    onSuccess: ({ updateAddress }) => {
      reset(updateAddress);
    }
  });
  const { errors, isValid, isDirty } = formState;
  const onSubmit = (address: AddressResult) => {
    updateAddressMutation.mutate({
      address: {
        ...address,
        country: "USA"
      }
    });
  };

  return (
    <section>
      <h2>Address</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={profileStyles.addressSection}>
          <span>
            Enter the address where you’re registered to vote - that’s the only thing we save, so we can serve you relevant local government information.
          </span>
          <Controller
            name="line1"
            control={control}
            rules={{ required: "Address line 1 is required" }}
            render={({ field: { ref, ...other } }) => {
              return (
                <TextInput ref={ref} errors={errors.line1?.message} id="address-street" label="Street Address" placeholder={"Street address"} hideLabel {...other} />
              );
            }}
          />
          <Controller
            name="line2"
            control={control}
            render={({ field: { ref, ...other } }) => {
              return (
                <TextInput ref={ref} errors={errors.line2?.message} id="address-line-2" label="Apartment, unit, suite, floor #, etc." placeholder={"Apartment, unit, suite, floor #, etc."} hideLabel {...other} />
              );
            }}
          />
          <div className={profileStyles.location}>
            <Controller
              name="city"
              control={control}
              rules={{ required: "City is required" }}
              render={({ field: { ref, ...other } }) => {
                return (
                  <TextInput ref={ref} errors={errors.city?.message} id="address-city" label="City" placeholder={"City"} {...other} hideLabel />
                );
              }}
            />
            
            <div>
              <select
                id="states"
                required
                {...register("state", {
                  required: "State is required",
                })}
              >
                <option value="">
                  State
                </option>
                {Object.entries(states).map(([key, value]) => (
                  <option key={key} value={key} label={value}>
                    {value}
                  </option>
                ))}
              </select>
              {errors.state?.message && <span className={profileStyles.errorMessage}>{errors.state.message}</span>}
            </div>

            <Controller
              name="postalCode"
              rules={{ required: "Zip code is required", pattern: /^[0-9]{5}$/ }}
              control={control}
              render={({ field: { ref, ...other } }) => {
                return (
                  <TextInput ref={ref} errors={errors.postalCode?.message} id="address-zip" label="Zip code" placeholder={"Zip code"} hideLabel {...other} />
                );
              }}
            />
          </div>
          <Button disabled={!isDirty || !isValid} variant="secondary" size="large" theme="blue" label="Save" type="submit" />
        </div>
      </form>
    </section>
  );
};

const SignOutSection = () => {
  const router = useRouter();
  const logOutMutation = useLogoutMutation({
    onSuccess: () => router.push("/login")
  });
  const handleSignOut = () => {
    logOutMutation.mutate();
  };
  return (
    <section>
      <h2>Sign out</h2>
      <div className={profileStyles.signOutSection}>
        <Button variant="secondary" size="large" theme="blue" label="Sign out" onClick={handleSignOut} />
      </div>
    </section>
  );
};

const DeleteAccountSection = () => {
  const [deleteConfirmationChecked, setDeleteConfirmationChecked] = useState<boolean>(false);

  const handleDeleteConfirmation = (e) => {
    setDeleteConfirmationChecked(e.target.checked);
  };

  const handleDeleteAccount = () => {
    return;
  };
  return (
    <section>
      <h2>Delete account</h2>
      <div className={profileStyles.deleteSection}>
        <span>All of your data will be deleted and can never be recovered.</span>
        <div className={profileStyles.deleteConfirmation}>
          <input type="checkbox" id="delete-confirmation" onChange={handleDeleteConfirmation} />
          <label htmlFor="delete-confirmation">Are you sure you want to completely delete your account?</label>
        </div>
        <Button variant="secondary" size="large" theme="blue" label="Delete" disabled={!deleteConfirmationChecked} onClick={handleDeleteAccount} />
      </div>
    </section>
  );
};

const PasswordSection = () => {
  const { control, handleSubmit, formState, getValues, reset } = useForm<{ oldPassword: string, newPassword: string, newPasswordConfirmation: string }>({
    mode: "onChange",
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      newPasswordConfirmation: ""
    }
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
        newPasswordConfirmation: ""
      });
    }
  });
  const { errors, isValid, isDirty } = formState;
  const onSubmit = ({
    oldPassword,
    newPassword
  }: {
    oldPassword: string,
    newPassword: string,
    newPasswordConfirmation: string
  }) => {
    updatePasswordMutation.mutate({
      oldPassword,
      newPassword
    });
  };
  return (
    <section>
      <h2>Password</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={profileStyles.passwordSection}>
          <Controller
            name="oldPassword"
            control={control}
            rules={{
              validate: (value: string) =>
                getValues("newPassword").length === 0 || value.length > 0 || "Current password is required",
            }}
            render={({ field: { ref, ...other } }) => {
              return (
                <TextInput ref={ref} errors={errors.oldPassword?.message} type="password" id="current-password" label="Old password" placeholder={"Old password"} hideLabel {...other} />
              );
            }}
          />
          <Controller
            name="newPassword"
            control={control}
            rules={{
              validate: () => isPasswordValid
            }}
            render={({ field: { ref, ...other } }) => {
              return (
                <TextInput ref={ref} errors={errors.newPassword?.message} type="password" id="new-password" label="New password" placeholder={"New password"} hideLabel {...other} />
              );
            }}
          />
          <Controller
            name="newPasswordConfirmation"
            control={control}
            rules={{
              required: "Password confirmation is required",
              validate: (value: string) =>
                value === getValues("newPassword") || "Passwords do not match",
            }}
            render={({ field: { ref, ...other } }) => {
              return (
                <TextInput ref={ref} errors={errors.newPasswordConfirmation?.message} type="password" id="confirm-password" label="Confirm password" placeholder={"Confirm password"} hideLabel {...other} />
              );
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
          <Button disabled={!isDirty || !isValid} variant="secondary" size="large" theme="blue" label="Save" type="submit" />
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
  if (!user) return null;
  const { userProfile = {}, email } = user || {};
  const {
    address = {},
    firstName = "",
    lastName = ""
  } = userProfile;

  return (
    <FlagSection hideFlagForMobile title="My Profile">
      <div className={profileStyles.profile}>
        {false && <ProfilePhotoSection />}
        <NameSection firstName={firstName} lastName={lastName} />
        <AddressSection address={address} />
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
