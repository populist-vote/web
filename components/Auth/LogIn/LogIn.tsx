import BasicLayout from "components/BasicLayout/BasicLayout";
import { useLogInMutation } from "generated";
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
    setError,
  } = useForm();

  const [loginError, setLoginError] = useState<string | null>(null);

  const login = useLogInMutation({
    onError: (error, variables, context) => {
      if (error instanceof Error) setLoginError(error.message as string);
    },
    onSuccess: (data, variables, context) => {
      // Check cookies for token
      router.push("/ballot");
    },
  });

  const submitForm = (data: any) => {
    login.mutate(data);
  };

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
            <Link href="/auth/reset-password" passHref>
              <small className={layoutStyles.textLink}>
                I forgot my username or password.
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
