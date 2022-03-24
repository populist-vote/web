import BasicLayout from "components/BasicLayout/BasicLayout";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import styles from "../Auth/Auth.module.scss";
import { useResetPasswordMutation } from "../../generated";

type PasswordFormValues = { password: string; confirmPassword: string };

export function ResetPasswordForm() {
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<PasswordFormValues>();

  const router = useRouter();
  const {
    query: { token },
  } = router;

  const mutation = useResetPasswordMutation({
    onSuccess: (data: { resetPassword: boolean }) => {
      if (data.resetPassword) setIsSuccess(true);
    },
  });

  const submitForm = (data: PasswordFormValues) => {
    mutation.mutate({
      newPassword: data.password,
      resetToken: token as string,
    });
  };

  if (isSuccess)
    return (
      <BasicLayout>
        <div className={styles.container}>
          <h1>Your password has been reset</h1>
          <Link href={"/login"} passHref>
            <button>Login</button>
          </Link>
        </div>
      </BasicLayout>
    );

  return (
    <BasicLayout>
      <div className={styles.container}>
        <h1 className="title">Change your password</h1>
        <p>
          With current technologies, a ten character alphanumeric password takes
          around 5 years to crack.
        </p>
        <div className={styles.formWrapper}>
          <form onSubmit={handleSubmit(submitForm)}>
            <div
              className={`${styles.inputWrapper} ${
                errors.password && styles.invalid
              }`}
            >
              <input
                type="password"
                placeholder="Password"
                {...register("password", { required: "Password is required" })}
              />
            </div>
            <div
              className={`${styles.inputWrapper} ${
                errors.confirmPassword && styles.invalid
              }`}
            >
              <input
                type="password"
                placeholder="Confirm Password"
                {...register("confirmPassword", {
                  required: "Confirm password is required",
                  validate: (value: string) => value === getValues("password"),
                })}
              />
            </div>
            <button>Submit</button>
            <br />
            {Object.entries(errors).map(([key, value]) => (
              <small key={key} className={styles.formError}>
                {value.message}
              </small>
            ))}
          </form>
        </div>
      </div>
    </BasicLayout>
  );
}
