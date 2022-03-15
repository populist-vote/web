import {
  BeginUserRegistrationInput,
  useValidateEmailAvailableQuery,
} from "generated";
import { useStateMachine } from "little-state-machine";
import { useForm } from "react-hook-form";
import { updateAction } from "pages/register";
import styles from "../Auth.module.scss";
import { useRouter } from "next/router";
import Link from "next/link";

export function EmailStep() {
  const router = useRouter();

  const {
    actions,
    state: { signupFormState },
  } = useStateMachine({ updateAction });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setError,
  } = useForm({
    reValidateMode: "onChange",
    defaultValues: {
      firstName: signupFormState.firstName,
      lastName: signupFormState.lastName,
      email: signupFormState.email,
      password: signupFormState.password,
    },
  });

  const {
    error: validateEmailError,
    refetch: validateEmailAvailable,
    isLoading,
  } = useValidateEmailAvailableQuery(
    {
      email: signupFormState.email,
    },
    {
      retry: false,
      refetchOnWindowFocus: false,
      enabled: false,
    }
  );

  const submitForm = (data: any) => {
    actions.updateAction(data);
    validateEmailAvailable().then(({ data, error }) => {
      if (data?.validateEmailAvailable) {
        router.push({ query: { step: "address" } });
      } else {
        setError(
          "email",
          {
            type: "manual",
            message: "This email is already associated with another account.",
          },
          {
            shouldFocus: true,
          }
        );
      }
    });
  };

  return (
    <div className={styles.container}>
      <h1 className="title">Get Started</h1>
      <p>All we need is your name, email, a strong password to get started.</p>
      <div className={styles.formWrapper}>
        <form onSubmit={handleSubmit(submitForm)}>
          <div className={styles.flexBetween}>
            <div
              className={`${styles.inputWrapper} ${
                errors.firstName && styles.invalid
              }`}
            >
              <input
                type="text"
                placeholder="First Name"
                {...register("firstName", {
                  required: "First name is required",
                })}
              />
            </div>
            <div
              className={`${styles.inputWrapper} ${
                errors.lastName && styles.invalid
              }`}
            >
              <input
                type="text"
                placeholder="Last Name"
                {...register("lastName", {
                  required: "Last name is required",
                })}
              />
            </div>
          </div>
          <div
            className={`${styles.inputWrapper} ${
              errors.email && styles.invalid
            }`}
          >
            <input
              type="text"
              placeholder="Email"
              aria-invalid={errors.email ? "true" : "false"}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              // Need to update email synchronously so that we can revalidate it on each form submission
              onChange={(e) => actions.updateAction({ email: e.target.value })}
            />
          </div>
          <div
            className={`${styles.inputWrapper} ${
              errors.password && styles.invalid
            }`}
          >
            <input
              type="password"
              placeholder="Password"
              aria-invalid={errors.password ? "true" : "false"}
              {...register("password", { required: "Password is required" })}
            />
          </div>
          <button disabled={isLoading}>
            {isLoading ? "Loading..." : "Continue"}
          </button>
          <br />
          <small className={styles.formError}>{errors?.email?.message}</small>
        </form>
      </div>
      <Link href="/faq#no-google-fb-signin" passHref>
        <small className={styles.footnote}>
          Why can't I sign in with Facebook or Google?
        </small>
      </Link>
    </div>
  );
}
