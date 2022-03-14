import styles from "./SignUp.module.scss";
import { useEffect, useState } from "react";
import BasicLayout from "components/BasicLayout/BasicLayout";
import { useRouter } from "next/router";
import { EmailStep } from "./EmailStep";
import { AddressStep } from "./AddressStep";

export type SignUpStep = "email" | "address";

export function SignUp({ step }: { step: SignUpStep }) {
  const router = useRouter();
  const { step: stepParam } = router.query;
  const [currentStep, setCurrentStep] = useState<SignUpStep>(
    (stepParam ?? step) as SignUpStep
  );

  useEffect(() => {
    if (stepParam) setCurrentStep(stepParam as SignUpStep);
  }, [stepParam]);

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
