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
import useDebounce from "hooks/useDebounce";
import { Button, PasswordEntropyMeter } from "components";
import { PasswordInput } from "../PasswordInput";

function EmailStep() {
  const router = useRouter();
  const { query } = router;

  const {
    actions,
    state: { loginFormState },
  } = useStateMachine({ updateAction });

  const debouncedPassword = useDebounce(loginFormState.password, 500);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    reValidateMode: "onChange",
    defaultValues: {
      email: loginFormState.email,
      password: loginFormState.password,
    },
  });

  const { refetch: validateEmailAvailable, isLoading } =
    useValidateEmailAvailableQuery(
      {
        email: loginFormState.email,
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
      enabled: loginFormState.password.length > 0,
    }
  );

  const {
    valid: isPasswordValid,
    score,
    message,
  } = passwordEntropyData?.validatePasswordEntropy ?? {};

  const submitForm = (data: { email: string; password: string }) => {
    actions.updateAction(data);
    validateEmailAvailable()
      .then(
        // Shamefully typecast to any
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ({ data: response, error }: { data: any; error: any }) => {
          if (response?.validateEmailAvailable) {
            void router.push({
              pathname: "/register/address",
              query: { ...query },
            });
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
      )
      .catch((error) => {
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
      });
  };

  return (
    <div className={styles.container}>
      <h1 className="title">Get Started</h1>
      <p>
        All we need is your email and a strong password to get started.{" "}
        <Link href="/faq#no-google-fb-login" passHref>
          <small className={styles.footnote}>
            Why can't I sign in with Facebook or Google?
          </small>
        </Link>
      </p>
      <div className={styles.formWrapper}>
        <form onSubmit={handleSubmit(submitForm)} data-testid="register-form-1">
          <div
            className={`${styles.inputWrapper} ${
              errors.email && styles.invalid
            }`}
          >
            <input
              type="email"
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
            <PasswordInput
              name="password"
              placeholder="Password"
              aria-invalid={errors.password ? "true" : "false"}
              register={register}
              rules={{
                required: "Password is required",
                validate: () => isPasswordValid,
              }}
              onChange={async (e) =>
                actions.updateAction({ password: e.target.value })
              }
            />
            <PasswordEntropyMeter
              valid={isPasswordValid}
              score={score}
              message={message}
              length={loginFormState.password.length}
              isLoading={isEntropyCalcLoading}
            />
          </div>
          <Button
            variant="primary"
            type="submit"
            label={isLoading ? "Loading..." : "Continue"}
            disabled={isLoading || isEntropyCalcLoading || !isPasswordValid}
            size="large"
          />
          <br />
          <small className={styles.formError}>{errors?.email?.message}</small>
          <small className={styles.formError}>
            {errors?.password?.message}
          </small>
        </form>
      </div>
    </div>
  );
}

export { EmailStep };
