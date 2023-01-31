import { BasicLayout, Button } from "components";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactNode, useState } from "react";
import { useForm } from "react-hook-form";
import styles from "../Auth/Auth.module.scss";
import {
  useResetPasswordMutation,
  useValidatePasswordEntropyQuery,
} from "../../generated";
import { PasswordEntropyMeter } from "./Register/PasswordEntropyMeter/PasswordEntropyMeter";
import useDebounce from "hooks/useDebounce";
import { PasswordInput } from "./PasswordInput";

type PasswordFormValues = { password: string; confirmPassword: string };

function ResetPasswordForm() {
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

  const [password, setPassword] = useState("");
  const debouncedPassword = useDebounce(password, 500);

  const {
    data: passwordEntropyData = {
      validatePasswordEntropy: {
        valid: false,
        score: 0,
        message: null,
      },
    },
    isLoading: isEntropyCalcLoading,
    fetchStatus,
  } = useValidatePasswordEntropyQuery(
    {
      password: debouncedPassword,
    },
    {
      refetchOnWindowFocus: false,
      enabled: password.length > 0,
    }
  );

  const {
    valid: isPasswordValid,
    score,
    message,
  } = passwordEntropyData?.validatePasswordEntropy ?? {};

  const submitForm = (data: PasswordFormValues) => {
    mutation.mutate({
      newPassword: data.password,
      resetToken: token as string,
    });
  };

  if (isSuccess)
    return (
      <div className={styles.container}>
        <h1>Your password has been reset</h1>
        <Link href={"/login"} passHref>
          <Button label="Login" size="large" variant="primary" theme="blue" />
        </Link>
      </div>
    );

  return (
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
            <PasswordInput
              name="password"
              placeholder="Password"
              register={register}
              rules={{
                required: "Password is required",
                validate: () => isPasswordValid,
              }}
              autoComplete="new-password"
              onChange={async (e) => setPassword(e.target.value)}
            />
          </div>
          <div
            className={`${styles.inputWrapper} ${
              errors.confirmPassword && styles.invalid
            }`}
          >
            <PasswordInput
              name="confirmPassword"
              placeholder="Confirm Password"
              register={register}
              autoComplete="new-password"
              rules={{
                required: "Confirm password is required",
                validate: (value: string) =>
                  value === getValues("password") || "Passwords do not match",
              }}
            />
          </div>
          <PasswordEntropyMeter
            valid={isPasswordValid}
            score={score}
            message={message}
            length={password.length}
            isLoading={isEntropyCalcLoading && fetchStatus != "idle"}
          />
          <Button label="Submit" size="large" variant="primary" theme="blue" />
          <br />
          {Object.entries(errors).map(([key, value]) => (
            <small key={key} className={styles.formError}>
              {value.message}
            </small>
          ))}
        </form>
      </div>
    </div>
  );
}

ResetPasswordForm.getLayout = (page: ReactNode) => (
  <BasicLayout>{page}</BasicLayout>
);

export { ResetPasswordForm };
