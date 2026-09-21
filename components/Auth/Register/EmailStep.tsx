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
import { Button, PasswordEntropyMeter, TextInput } from "components";
import { PasswordInput } from "../PasswordInput";
import clsx from "clsx";
import { Trans, useTranslation } from "next-i18next";
import Link from "next/link";

function EmailStep() {
  const router = useRouter();
  const { query } = router;
  const { email: prefillEmail } = query as { email: string };
  const { t } = useTranslation(["auth", "common"]);

  const {
    actions,
    state: { loginFormState },
  } = useStateMachine({ actions: { updateAction } });

  const debouncedPassword = useDebounce(loginFormState.password, 500);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({
    reValidateMode: "onChange",
    defaultValues: {
      email: prefillEmail ?? loginFormState.email,
      password: loginFormState.password,
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
    fetchStatus: passwordEntropyFetchStatus,
  } = useValidatePasswordEntropyQuery(
    {
      password: debouncedPassword,
    },
    {
      refetchOnWindowFocus: false,
      enabled: loginFormState.password.length > 0,
    },
  );

  const {
    valid: isPasswordValid,
    score,
    message,
  } = passwordEntropyData?.validatePasswordEntropy ?? {};

  const loginHref = {
    pathname: "/login",
    query: { ...query, email: prefillEmail ?? loginFormState.email },
  };

  const submitForm = async (data: { email: string; password: string }) => {
    const email = data.email.trim().toLowerCase();
    actions.updateAction({ ...data, email });

    try {
      // Read the submitted value directly: invite-prefilled fields and browser
      // autofill do not necessarily update the persisted registration state.
      const response = await useValidateEmailAvailableQuery.fetcher({
        email,
      })();
      if (response.validateEmailAvailable) {
        await router.push({ pathname: "/register/address", query });
      } else if (query.inviteToken) {
        await router.push({
          pathname: "/login",
          query: { ...query, email },
        });
      } else {
        setError(
          "email",
          { type: "manual", message: "Email address is already in use" },
          { shouldFocus: true },
        );
      }
    } catch (error) {
      setError(
        "email",
        {
          type: "manual",
          message:
            error instanceof Error ? error.message : "Unable to check email",
        },
        { shouldFocus: true },
      );
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.signInTitle}>
        {t("get-started", { ns: "common" })}
      </h1>
      <p className={styles.subtitle}>
        {t("please-create-account-copy")}{" "}
        <span className={styles.signInSubtitle}>
          <Trans i18nKey={"auth:have-account-helper"}>
            <Link href={loginHref} className={styles.textLink}></Link>
          </Trans>
        </span>
      </p>
      <div className={styles.formWrapper}>
        <form onSubmit={handleSubmit(submitForm)} data-testid="register-form-1">
          <div
            className={clsx(
              styles.inputWrapper,
              errors.email && styles.invalid,
            )}
          >
            <TextInput
              name="email"
              type="email"
              placeholder={t("email")}
              aria-invalid={errors.email ? "true" : "false"}
              register={register}
              control={control}
              rules={{
                // Keep the email available when moving between registration steps.
                onChange: (e) => {
                  if (actions?.updateAction) {
                    actions.updateAction({ email: e.target.value });
                  }
                },
                required: t("email-is-required"),
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: t("invalid-email"),
                },
              }}
              autoComplete="email"
              autoFocus
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
              control={control}
              rules={{
                required: t("password-is-required"),
                validate: () => isPasswordValid,
              }}
              autoFocus={!!prefillEmail}
              autoComplete="new-password"
              onChange={async (e) => {
                if (actions?.updateAction) {
                  actions.updateAction({ password: e.target.value });
                }
              }}
            />
            <PasswordEntropyMeter
              valid={isPasswordValid}
              score={score}
              message={message}
              length={loginFormState.password.length}
              isLoading={
                isEntropyCalcLoading && passwordEntropyFetchStatus != "idle"
              }
            />
            <small className={styles.footnote}>{t("passwords-copy")} </small>
          </div>
          <Button
            variant="primary"
            type="submit"
            label={
              isSubmitting
                ? t("loading", { ns: "common" })
                : t("continue", { ns: "common" })
            }
            disabled={
              isSubmitting ||
              (isEntropyCalcLoading && passwordEntropyFetchStatus != "idle") ||
              !isPasswordValid
            }
            size="large"
          />
          <small className={styles.formError}>
            {errors?.email?.message as string}
          </small>
          <small className={styles.formError}>
            {errors?.password?.message as string}
          </small>
        </form>
      </div>
    </div>
  );
}

export { EmailStep };
