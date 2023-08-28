import React from "react";
import { Container } from "../Container";
import { useAppSelector } from "@/hooks";
import { PersonalDetailsForm } from "./PersonalDetailsForm";
import { KYCDetailsForm } from "./KYCDetailsForm";
import { BankDetailsForm } from "./BankDetailsForm";

export const KYCForms = () => {
  const { currentStep } = useAppSelector((state) => state.step);
  return (
    <>
      <Container>
        {currentStep == 1 && <PersonalDetailsForm />}
        {currentStep == 2 && <KYCDetailsForm />}
        {currentStep == 3 && <BankDetailsForm />}
      </Container>
    </>
  );
};
