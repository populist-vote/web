import {
  useValidateEmailAvailableQuery,
  useValidatePasswordEntropyQuery,
} from "generated";
import { useStateMachine } from "little-state-machine";
import { useForm } from "react-hook-form";
import { updateAction } from "pages/register";
import styles from "../Auth.module.scss";
import { useRouter } from "next/router";
import useDebounce from "hooks/useDebounce";
import { Button, PasswordEntropyMeter } from "components";
import { PasswordInput } from "../PasswordInput";
import clsx from "clsx";
import { useTranslation } from "next-i18next";

function EmailStep() {
  const router = useRouter();
  const { query } = router;
  const { t } = useTranslation("auth");

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
      <h1 className="title">{t("get-started")}</h1>
      <p>
        {t("please-create-account-copy")}{" "}
        <span className={styles.footnote}>{t("passwords-copy")}</span>
      </p>
      <div className={styles.formWrapper}>
        <form onSubmit={handleSubmit(submitForm)} data-testid="register-form-1">
          <div
            className={clsx(
              styles.inputWrapper,
              errors.email && styles.invalid
            )}
          >
            <input
              type="email"
              placeholder={t("email")}
              aria-invalid={errors.email ? "true" : "false"}
              {...register("email", {
                required: t("email-is-required"),
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: t("invalid-email"),
                },
              })}
              autoComplete="email"
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
              placeholder={t("password")}
              aria-invalid={errors.password ? "true" : "false"}
              register={register}
              rules={{
                required: t("password-is-required"),
                validate: () => isPasswordValid,
              }}
              autoComplete="new-password"
              onChange={async (e) =>
                actions.updateAction({ password: e.target.value })
              }
            />
            <br />
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
            label={isLoading ? t("loading") : t("continue")}
            disabled={isLoading || isEntropyCalcLoading || !isPasswordValid}
            size="large"
          />
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
