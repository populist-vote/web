import BasicLayout from "components/BasicLayout/BasicLayout";
import { useCurrentUserQuery, useLogInMutation } from "generated";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import styles from "../Auth.module.scss";
import layoutStyles from "../../BasicLayout/BasicLayout.module.scss";

export function LogIn() {
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
  if (user) router.push("/ballot");

  const login = useLogInMutation({
    onError: (error) => {
      if (error instanceof Error) setLoginError(error.message as string);
    },
    onSuccess: () => {
      getCurrentUser.refetch().then((data: any) => {
        if (data?.currentUser) router.push("/ballot");
      });
    },
  });

  const submitForm = (data: any) => {
    login.mutate(data);
  };

  if (user || isLoading) return null;

  return (
    <BasicLayout hideFooter>
      <div className={styles.container}>
        <h1>Log In</h1>
        <div className={styles.formWrapper}>
          <form onSubmit={handleSubmit(submitForm)}>
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
              <input
                type="password"
                placeholder="Password"
                {...register("password", {
                  required: "Password is required",
                  minLength: 10,
                })}
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
