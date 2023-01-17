import { BasicLayout, Button } from "components";
import { useCurrentUserQuery, useLogInMutation } from "generated";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import styles from "../Auth.module.scss";
import layoutStyles from "../../BasicLayout/BasicLayout.module.scss";
import { PasswordInput } from "../PasswordInput";
import { useTranslation } from "next-i18next";

function LogIn() {
  const router = useRouter();
  const { t } = useTranslation(["auth", "common"]);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

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
        if (result.data?.currentUser) void router.push("/home");
      }),
  });

  const submitForm = (data: any) => {
    login.mutate(data);
  };

  let message = "";

  if (user || isLoading) return null;
  if (router.query.next?.includes("/voting-guides")) {
    message = t("voting-guide-sign-in");
  } else {
    message = t("sign-in");
  }

  return (
    <BasicLayout hideFooter>
      <div className={styles.container}>
        <h2 className={styles.signInTitle}>{message}</h2>
        <div className={styles.formWrapper}>
          <form onSubmit={handleSubmit(submitForm)} data-testid="login-form">
            <div
              className={`${styles.inputWrapper} ${
                errors.emailOrUsername && styles.invalid
              }`}
            >
              <input
                type="text"
                placeholder={t("email-or-username") as string}
                {...register("emailOrUsername", {
                  required: t("email-or-username-is-required") as string,
                })}
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
                rules={{ required: t("password-is-required") as string }}
                autoComplete="current-password"
              />
            </div>
            <Button
              label={
                login.isLoading ? t("loading", { ns: "common" }) : t("sign-in")
              }
              size="large"
              variant="primary"
              theme="blue"
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
    </BasicLayout>
  );
}

export { LogIn };
