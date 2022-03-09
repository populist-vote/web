import { LogoText } from "components/LogoText/LogoText";
import { useForm } from "react-hook-form";
import styles from "./SignUp.module.scss";

export function SignUp() {
  const { register, handleSubmit, formState } = useForm();

  console.log(formState.errors);

  const submitForm = (data: any) => alert(JSON.stringify(data));

  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        <div>
          <LogoText />
        </div>
      </div>
      <div className={styles.formWrapper}>
        <h1 className="title">Get Started</h1>
        <p>All we need is your email to get started. </p>
        <form onSubmit={handleSubmit(submitForm)}>
          <div className={styles.inputWrapper}>
            <input
              type="text"
              placeholder="Email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
            />
            <small className={styles.inputError}>
              {formState.errors.email && formState.errors.email.message}
            </small>
          </div>
          <button>Create Account</button>
        </form>
      </div>
    </div>
  );
}
