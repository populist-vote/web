import { useEffect, useState } from "react";
import { BasicLayout } from "components";
import { useRouter } from "next/router";
import { EmailStep } from "./EmailStep";
import { AddressStep } from "./AddressStep";

type RegisterStep = "email" | "address";

function Register({ step }: { step: RegisterStep }) {
  const router = useRouter();
  const { step: stepParam } = router.query;
  const [currentStep, setCurrentStep] = useState<RegisterStep>(
    (stepParam ?? step) as RegisterStep
  );

  useEffect(() => {
    if (stepParam) setCurrentStep(stepParam as RegisterStep);
  }, [stepParam]);

  const renderStep = () => {
    switch (currentStep) {
      case "email":
        return <EmailStep />;
      case "address":
        return <AddressStep />;
    }
  };

  return <BasicLayout hideFooter>{renderStep()}</BasicLayout>;
}

export type { RegisterStep };
export { Register };
