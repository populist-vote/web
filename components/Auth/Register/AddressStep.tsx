import {
  AddressInput,
  BeginUserRegistrationInput,
  useBeginUserRegistrationMutation,
} from "generated";
import { useStateMachine } from "little-state-machine";
import Link from "next/link";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import styles from "../Auth.module.scss";
import { updateAction } from "pages/register";
import states from "util/states";
import { useEffect } from "react";

export function AddressStep() {
  const router = useRouter();

  const {
    actions,
    state: { loginFormState },
  } = useStateMachine({ updateAction });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      address: loginFormState.address,
    },
  });

  const handleUserRegistration = useBeginUserRegistrationMutation({
    onError: (error: Error) => alert(error.message),
    onSuccess: () => router.push("/ballot"),
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
      <h1>Get Local</h1>
      <p>
        For a more personalized experience, we'll need the address where you're
        registered to vote so we can localize your ballot information. Don't
        worry, this will not be shared with anyone.
      </p>
      <div className={styles.formWrapper}>
        <form onSubmit={handleSubmit(submitForm)}>
          <div
            className={`${styles.inputWrapper} ${
              errors?.address?.line1 && styles.invalid
            }`}
          >
            <input
              type="text"
              placeholder="Street Address"
              {...register("address.line1", {
                required: "Address line 1 is required",
              })}
            />
          </div>
          <div
            className={`${styles.inputWrapper} ${
              errors?.address?.line2 && styles.invalid
            }`}
          >
            <input
              type="text"
              placeholder="Apartment, unit, suite, floor #, etc."
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
              placeholder="City"
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
                  State
                </option>
                {Object.entries(states).map(([key, value]) => (
                  <option key={key} value={key} label={value} />
                ))}
              </select>
            </div>
            <div
              className={`${styles.inputWrapper} ${
                errors?.address?.postalCode && styles.invalid
              }`}
            >
              <input
                type="text"
                placeholder="Postal Code"
                {...register("address.postalCode", {
                  required: "Postal code is required",
                })}
              />
            </div>
          </div>
          <button>Show Me My Ballot</button>
          <br />
          <Link href="/register?step=email">Back</Link>
        </form>
      </div>
    </div>
  );
}
