import { LogoText } from "components/LogoText/LogoText";
import { useForm } from "react-hook-form";
import styles from "./SignUp.module.scss";
import utils from "styles/utils.module.scss";
import { useState } from "react";
import Link from "next/link";
import BasicLayout from "components/BasicLayout/BasicLayout";

export function SignUp() {
  const [currentStep, setCurrentStep] = useState(1);

  function Step1() {
    const { register, handleSubmit, formState } = useForm();
    console.log(formState.errors);
    const submitForm = (data: any) => {
      alert(JSON.stringify(data));
      setCurrentStep(currentStep + 1);
    };

    return (
      <>
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
          <button>Continue</button>
        </form>
        <Link href="/faq#no-google-fb-signin" passHref>
          <small className={styles.footnote}>
            Why can't I sign in with Facebook or Google?
          </small>
        </Link>
      </>
    );
  }

  function Step2() {
    const { register, handleSubmit, formState } = useForm();

    const submitForm = (data: any) => alert(JSON.stringify(data));
    return (
      <>
        <h1 className="title">Get Local</h1>
        <p>
          For a more personalized experience, please provide the address where
          you're registered to vote so we can localize your ballot information.
        </p>
        <form onSubmit={handleSubmit(submitForm)}>
          <div className={styles.flexBetween}>
            <div className={styles.inputWrapper}>
              <input
                type="text"
                placeholder="First Name"
                {...register("firstName", {
                  required: "First name is required",
                })}
              />
              <small className={styles.inputError}>
                {formState.errors.firstName &&
                  formState.errors.firstName.message}
              </small>
            </div>
            <div className={styles.inputWrapper}>
              <input
                type="text"
                placeholder="Last Name"
                {...register("lastName", {
                  required: "Last name is required",
                })}
              />
              <small className={styles.inputError}>
                {formState.errors.lastName && formState.errors.lastName.message}
              </small>
            </div>
          </div>
          <div className={styles.inputWrapper}>
            <input
              type="text"
              placeholder="Street Address"
              {...register("line1")}
            />
            <small className={styles.inputError}>
              {formState.errors.line1 && formState.errors.line1.message}
            </small>
          </div>
          <div className={styles.inputWrapper}>
            <input
              type="text"
              placeholder="Apartment, unit, suite, floor #, etc."
              {...register("line2")}
            />
            <small className={styles.inputError}>
              {formState.errors.line2 && formState.errors.line2.message}
            </small>
          </div>
          <div className={styles.inputWrapper}>
            <input type="text" placeholder="City" {...register("city")} />
            <small className={styles.inputError}>
              {formState.errors.city && formState.errors.city.message}
            </small>
          </div>
          <div className={styles.flexBetween}>
            <div className={styles.inputWrapper}>
              <input type="text" placeholder="State" {...register("state")} />
              <small className={styles.inputError}>
                {formState.errors.state && formState.errors.state.message}
              </small>
            </div>
            <div className={styles.inputWrapper}>
              <input
                type="text"
                placeholder="Postal Code"
                {...register("postalCode")}
              />
              <small className={styles.inputError}>
                {formState.errors.postalCode &&
                  formState.errors.lastName.postalCode}
              </small>
            </div>
          </div>
          <div className={styles.inputWrapper}>
            <input type="text" placeholder="Country" {...register("country")} />
            <small className={styles.inputError}>
              {formState.errors.country && formState.errors.country.message}
            </small>
          </div>
          <button>Create Account</button>
          <br />
          <a onClick={() => setCurrentStep(3)}>Skip This Step</a>
        </form>
      </>
    );
  }

  function Step3() {
    const { register, handleSubmit, formState } = useForm();

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
              {formState.errors.password && formState.errors.password.message}
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
              {formState.errors.confirmPassword &&
                formState.errors.confirmPassword.message}
            </small>
          </div>
          <button>Create Account</button>
          <br />
          <Link href="/ballot">Skip This Step</Link>
        </form>
      </>
    );
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1 />;
      case 2:
        return <Step2 />;
      case 3:
        return <Step3 />;
    }
  };

  return (
    <BasicLayout hideFooter>
      <div className={styles.formWrapper}>{renderStep()}</div>
    </BasicLayout>
  );
}
