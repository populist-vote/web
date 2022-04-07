import {
  useValidateEmailAvailableQuery,
  useValidatePasswordEntropyQuery,
} from "generated";
import { useStateMachine } from "little-state-machine";
import { useForm } from "react-hook-form";
import { updateAction } from "pages/register";
import styles from "../Auth.module.scss";
import { useRouter } from "next/router";
import Link from "next/link";
import { PasswordEntropyMeter } from "./PasswordEntropyMeter/PasswordEntropyMeter";
import useDebounce from "hooks/useDebounce";

export function EmailStep() {
  const router = useRouter();

  const {
    actions,
    state: { signupFormState },
  } = useStateMachine({ updateAction });

  const debouncedPassword = useDebounce(signupFormState.password, 500);

  const {
    register,
    handleSubmit,
    formState: { errors },
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

  const { refetch: validateEmailAvailable, isLoading } =
    useValidateEmailAvailableQuery(
      {
        email: signupFormState.email,
      },
      // Only want to run this on form submission
      {
        retry: false,
        refetchOnWindowFocus: false,
        enabled: false,
      }
    );

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
      enabled: signupFormState.password.length > 0,
    }
  );

  const {
    valid: isPasswordValid,
    score,
    message,
  } = passwordEntropyData?.validatePasswordEntropy!;

  const submitForm = (data: any) => {
    actions.updateAction(data);
    validateEmailAvailable().then(
      // Shamefully typecast to any
      ({ data: response, error }: { data: any; error: any }) => {
        if (response?.validateEmailAvailable) {
          router.push({ query: { step: "address" } });
        } else {
          setError(
            "email",
            {
              type: "manual",
              message: "Email address is already in use",
            },
            {
              shouldFocus: true,
            }
          );
        }

        // Handle errors like network down - eventually we should useAlert here and
        // create an alertContext for more global errors
        if (error instanceof Error) {
          setError(
            "email",
            {
              type: "manual",
              message: error?.message,
            },
            {
              shouldFocus: true,
            }
          );
        }
      }
    );
  };

  return (
    <div className={styles.container}>
      <h1 className="title">Get Started</h1>
      <p>
        All we need is your name, email, and a strong password to get started.{" "}
        <Link href="/faq#no-google-fb-signin" passHref>
          <small className={styles.footnote}>
            Why can't I sign in with Facebook or Google?
          </small>
        </Link>
      </p>
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
                onChange={(e) =>
                  actions.updateAction({ firstName: e.target.value })
                }
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
                onChange={(e) =>
                  actions.updateAction({ lastName: e.target.value })
                }
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
              {...register("password", {
                required: "Password is required",
                validate: () => isPasswordValid,
              })}
              onChange={(e) =>
                actions.updateAction({ password: e.target.value })
              }
            />
            <PasswordEntropyMeter
              valid={isPasswordValid}
              score={score}
              message={message}
              length={signupFormState.password.length}
              isLoading={isEntropyCalcLoading}
            />
          </div>
          <button disabled={isLoading}>
            {isLoading ? "Loading..." : "Continue"}
          </button>
          <br />
          <small className={styles.formError}>{errors?.email?.message}</small>
        </form>
      </div>
    </div>
  );
}
