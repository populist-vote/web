import { BasicLayout } from "components";
import { useCurrentUserQuery, useLogInMutation } from "generated";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import styles from "../Auth.module.scss";
import layoutStyles from "../../BasicLayout/BasicLayout.module.scss";
import { PasswordInput } from "../PasswordInput";

function LogIn() {
  const router = useRouter();
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const submitForm = (data: any) => {
    login.mutate(data);
  };

  let message = "";

  if (user || isLoading) return null;
  if (router.query.next?.includes("voting-guide")) {
    message = "Please sign in or create an account to view voting guides.";
  } else {
    message = "Sign in";
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
                placeholder="Email or Username"
                {...register("emailOrUsername", {
                  required: "Email or Username is required",
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
                rules={{ required: "Password is required" }}
              />
            </div>
            <button>{login.isLoading ? "Loading..." : "Sign In"}</button>
            <br />
            <Link href="/auth/reset" passHref>
              <small className={layoutStyles.textLink}>
                Forgot your password?
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
