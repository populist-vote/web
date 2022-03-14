import Link from "next/link";
import { useForm } from "react-hook-form";
import styles from "./SignUp.module.scss";

export function PasswordForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const submitForm = (data: any) => alert(JSON.stringify(data));
  return (
    <>
      <h1 className="title">Get Secure</h1>
      <p>
        With current technologies, a ten character alphanumeric password takes
        around 5 years to crack.
      </p>
      <form onSubmit={handleSubmit(submitForm)}>
        <div className={styles.inputWrapper}>
          <input
            type="text"
            placeholder="Password"
            {...register("password", { required: "Password is required" })}
          />
          <small className={styles.inputError}>
            {errors.password && errors.password.message}
          </small>
        </div>
        <div className={styles.inputWrapper}>
          <input
            type="text"
            placeholder="Confirm Password"
            {...register("confirmPassword", {
              required: "Confirm password is required",
            })}
          />
          <small className={styles.inputError}>
            {errors.confirmPassword && errors.confirmPassword.message}
          </small>
        </div>
        <button>Create Account</button>
        <br />
        <Link href="/ballot">Skip This Step</Link>
      </form>
    </>
  );
}
