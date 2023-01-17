import {
  AddressInput,
  BeginUserRegistrationInput,
  useBeginUserRegistrationMutation,
  useCurrentUserQuery,
} from "generated";
import { useStateMachine } from "little-state-machine";
import Link from "next/link";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import styles from "../Auth.module.scss";
import textInputStyles from "../../TextInput/TextInput.module.scss";
import { updateAction } from "pages/register";
import states from "utils/states";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "components/Button/Button";
import { useTranslation } from "next-i18next";

function AddressStep() {
  const router = useRouter();
  const { query } = router;
  const { t } = useTranslation(["auth", "common"]);

  const {
    actions,
    state: { loginFormState },
  } = useStateMachine({ updateAction });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<{ address: AddressInput }>({
    defaultValues: {
      address: loginFormState?.address,
    },
  });

  useEffect(() => {
    if (!loginFormState) void router.push("/register");
  }, [loginFormState, router]);

  const queryClient = useQueryClient();
  const queryKey = useCurrentUserQuery.getKey();

  const handleUserRegistration = useBeginUserRegistrationMutation({
    onError: (error: Error) => {
      if (error instanceof Error)
        setError("address.line1", { message: error.message });
    },
    onSuccess: () => {
      query.next
        ? void router.push(query.next as string)
        : void router.push("/home");
      void queryClient.invalidateQueries(queryKey);
    },
  });

  const submitForm = (data: { address: AddressInput }) => {
    actions.updateAction({ address: data.address });

    handleUserRegistration.mutate({
      ...loginFormState,
      address: data.address,
    } as BeginUserRegistrationInput);
  };

  return (
    <div className={styles.container}>
      <h2>{t("where-are-you-registered-copy")}</h2>
      <p>{t("we-use-your-address-copy")}</p>
      <div className={styles.formWrapper}>
        <form onSubmit={handleSubmit(submitForm)} data-testid="register-form-2">
          <div
            className={`${styles.inputWrapper} ${
              errors?.address?.line1 && styles.invalid
            }`}
          >
            <input
              type="text"
              placeholder={t("street-address") as string}
              {...register("address.line1", {
                required: "Address line 1 is required",
              })}
            />
            {errors?.address?.line1 && (
              <div className={textInputStyles.inputContainer}>
                <span className={textInputStyles.errorMessage}>
                  {errors.address.line1.message}
                </span>
              </div>
            )}
          </div>
          <div
            className={`${styles.inputWrapper} ${
              errors?.address?.line2 && styles.invalid
            }`}
          >
            <input
              type="text"
              placeholder={t("apartment-line") as string}
              {...register("address.line2")}
            />
          </div>
          <div
            className={`${styles.inputWrapper} ${
              errors?.address?.city && styles.invalid
            }`}
          >
            <input
              type="text"
              placeholder={t("city") as string}
              {...register("address.city", {
                required: "City is required",
              })}
            />
          </div>
          <div className={styles.flexBetween}>
            <div
              className={`${styles.inputWrapper} ${
                errors?.address?.state && styles.invalid
              }`}
            >
              <select
                id="states"
                defaultValue=""
                required
                {...register("address.state", {
                  required: "State is required",
                })}
              >
                <option disabled value="">
                  {t("state")}
                </option>
                {Object.entries(states).map(([key, value]) => (
                  <option key={key} value={key} label={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
            <div
              className={`${styles.inputWrapper} ${
                errors?.address?.postalCode && styles.invalid
              } ${styles.postalCode}`}
            >
              <input
                type="text"
                placeholder={t("postal-code") as string}
                {...register("address.postalCode", {
                  required: "Postal code is required",
                })}
              />
            </div>
          </div>
          <Button
            label={t("complete-registration")}
            size="large"
            variant="primary"
            theme="blue"
          />
          <br />
          <Link
            href={{
              pathname: "/register",
              query,
            }}
            shallow
            replace
          >
            {t("back")}
          </Link>
        </form>
      </div>
    </div>
  );
}

export { AddressStep };
