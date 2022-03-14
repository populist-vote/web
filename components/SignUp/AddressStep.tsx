import {
  BeginUserRegistrationInput,
  useBeginUserRegistrationMutation,
} from "generated";
import { useStateMachine } from "little-state-machine";
import Link from "next/link";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import styles from "./SignUp.module.scss";
import { updateAction } from "pages/signup";

export function AddressStep() {
  const router = useRouter();

  const {
    actions,
    state: { signupFormState },
  } = useStateMachine({ updateAction });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    defaultValues: {
      address: signupFormState.address,
    },
  });

  const handleUserRegistration = useBeginUserRegistrationMutation({
    // onSuccess: ({ beginUserRegistration }) => {
    //   let token = beginUserRegistration.accessToken;
    // },
  });

  const submitForm = (data: any) => {
    actions.updateAction(data);
    handleUserRegistration.mutate(
      signupFormState as BeginUserRegistrationInput
    );
    router.push("/ballot");
  };

  return (
    <>
      <h1 className="title">Get Local</h1>
      <p>
        For a more personalized experience, we'll need the address where you're
        registered to vote so we can localize your ballot information. Don't
        worry, this will not be shared with anyone.
      </p>
      <form onSubmit={handleSubmit(submitForm)}>
        <div className={styles.inputWrapper}>
          <input
            type="text"
            placeholder="Street Address"
            {...register("address.line1", {
              required: "Address line 1 is required",
            })}
          />
        </div>
        <div className={styles.inputWrapper}>
          <input
            type="text"
            placeholder="Apartment, unit, suite, floor #, etc."
            {...register("address.line2")}
          />
        </div>
        <div className={styles.inputWrapper}>
          <input
            type="text"
            placeholder="City"
            {...register("address.city", {
              required: "City is required",
            })}
          />
        </div>
        <div className={styles.flexBetween}>
          <div className={styles.inputWrapper}>
            <input
              type="text"
              placeholder="State"
              {...register("address.state", {
                required: "State is required",
              })}
            />
          </div>
          <div className={styles.inputWrapper}>
            <input
              type="text"
              placeholder="Postal Code"
              {...register("address.postalCode", {
                required: "Postal code is required",
              })}
            />
          </div>
        </div>
        <div className={styles.inputWrapper}>
          <input
            type="text"
            placeholder="Country"
            {...register("address.country", {
              required: "Country is required",
            })}
          />
        </div>
        <button>Show Me My Ballot</button>
        <br />
        <Link href="/signup?step=email">Back</Link>
      </form>
    </>
  );
}
