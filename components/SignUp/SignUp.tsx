import { LogoText } from "components/LogoText/LogoText";
import { useForm } from "react-hook-form";
import styles from "./SignUp.module.scss";
import utils from "styles/utils.module.scss";
import { useEffect, useState } from "react";
import Link from "next/link";
import BasicLayout from "components/BasicLayout/BasicLayout";
import { useRouter } from "next/router";

type SignUpStep = "email" | "address";

export function SignUp({ step }: { step: SignUpStep }) {
  const router = useRouter();
  const { step: stepParam } = router.query;
  const [currentStep, setCurrentStep] = useState<SignUpStep>(
    (router.query.step as SignUpStep) ?? "email"
  );

  useEffect(() => {
    setCurrentStep(stepParam as SignUpStep);
  }, [stepParam]);

  function EmailStep() {
    const { register, handleSubmit, formState } = useForm();

    const submitForm = (data: any) => {
      alert(JSON.stringify(data));
      setCurrentStep("address");
      router.push({ query: { step: "address" } });
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

  function AddressStep() {
    const { register, handleSubmit, formState } = useForm();

    const submitForm = (data: any) => alert(JSON.stringify(data));
    return (
      <>
        <h1 className="title">Get Local</h1>
        <p>
          For a more personalized experience, we'll need the address where
          you're registered to vote so we can localize your ballot information.
          Don't worry, this will not be shared with anyone.
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
              {...register("line1", {
                required: "Address line 1 is required",
              })}
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
            <input
              type="text"
              placeholder="City"
              {...register("city", {
                required: "City is required",
              })}
            />
            <small className={styles.inputError}>
              {formState.errors.city && formState.errors.city.message}
            </small>
          </div>
          <div className={styles.flexBetween}>
            <div className={styles.inputWrapper}>
              <input
                type="text"
                placeholder="State"
                {...register("state", {
                  required: "State is required",
                })}
              />
              <small className={styles.inputError}>
                {formState.errors.state && formState.errors.state.message}
              </small>
            </div>
            <div className={styles.inputWrapper}>
              <input
                type="text"
                placeholder="Postal Code"
                {...register("postalCode", {
                  required: "Postal code is required",
                })}
              />
              <small className={styles.inputError}>
                {formState.errors.postalCode &&
                  formState.errors.lastName.postalCode}
              </small>
            </div>
          </div>
          <div className={styles.inputWrapper}>
            <input
              type="text"
              placeholder="Country"
              {...register("country", {
                required: "Country is required",
              })}
            />
            <small className={styles.inputError}>
              {formState.errors.country && formState.errors.country.message}
            </small>
          </div>
          <button>Show Me My Ballot</button>
          <br />
          <Link href="/signup?step=email">Back</Link>
        </form>
      </>
    );
  }

  function PasswordStep() {
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
      case "email":
        return <EmailStep />;
      case "address":
        return <AddressStep />;
    }
  };

  return (
    <BasicLayout hideFooter>
      <div className={styles.formWrapper}>{renderStep()}</div>
    </BasicLayout>
  );
}
