import { Button, LoaderFlag, TextInput } from "components";
import { useCurrentUserQuery, useLogInMutation } from "generated";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import styles from "../Auth.module.scss";
import layoutStyles from "../../BasicLayout/BasicLayout.module.scss";
import { PasswordInput } from "../PasswordInput";
import { Trans, useTranslation } from "next-i18next";

function LogIn() {
  const router = useRouter();
  const { t } = useTranslation(["auth", "common"]);
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isValid, isDirty },
  } = useForm({ mode: "onChange" });

  const [loginError, setLoginError] = useState<string | null>(null);

  const getCurrentUser = useCurrentUserQuery();
  const { data, isLoading } = useCurrentUserQuery();
  const user = data?.currentUser;
  if (user) void router.push(`/${router.query.next || "/home"}`);

  const login = useLogInMutation({
    onError: (error) => {
      if (error instanceof Error) setLoginError(error.message as string);
    },
    onSuccess: () =>
      getCurrentUser.refetch().then((result) => {
        if (result.data?.currentUser) {
          if (router.query.next) {
            void router.push(`/${router.query.next}`);
          } else void router.push("/home");
        }
      }),
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const submitForm = (data: any) => {
    login.mutate(data);
  };

  let message = "";
  if (router.query.next?.includes("/voting-guides")) {
    message = t("voting-guide-sign-in");
  } else {
    message = t("sign-in");
  }

  if (isLoading) return <LoaderFlag />;

  return (
    <div className={styles.container}>
      <h1>{message}</h1>
      <p className={styles.subtitle}>
        <Trans i18nKey={"auth:no-account-helper"}>
          <Link href="/register" className={styles.textLink}></Link>
        </Trans>
      </p>
      <div className={styles.formWrapper}>
        <form onSubmit={handleSubmit(submitForm)} data-testid="login-form">
          <div
            className={`${styles.inputWrapper} ${
              errors.emailOrUsername && styles.invalid
            }`}
          >
            <TextInput
              name="emailOrUsername"
              rules={{
                required: t("email-or-username-is-required"),
              }}
              type="text"
              placeholder={t("email-or-username")}
              register={register}
              control={control}
            />
          </div>
          <div
            className={`${styles.inputWrapper} ${
              errors.password && styles.invalid
            }`}
          >
            <PasswordInput
              name="password"
              register={register}
              control={control}
              rules={{ required: t("password-is-required") }}
              autoComplete="current-password"
            />
          </div>
          <Button
            label={
              login.isPending ? t("loading", { ns: "common" }) : t("sign-in")
            }
            size="large"
            variant="primary"
            theme="blue"
            disabled={login.isPending || !isDirty || !isValid}
          />

          <br />
          <Link href="/auth/reset" passHref>
            <small className={layoutStyles.textLink}>
              {t("forgot-your-password")}
            </small>
          </Link>
          <br />
          <small className={styles.formError}>{loginError}</small>
        </form>
      </div>
    </div>
  );
}

export { LogIn };
