import React from "react";
import { Container } from "../Container";
import { useAppSelector } from "@/hooks";
import { PersonalDetailsForm } from "./PersonalDetailsForm";

export const KYCForms = () => {
  const { currentStep } = useAppSelector((state) => state.step);
  return (
    <>
      <Container>
        {currentStep == 1 ? <PersonalDetailsForm /> : <h1>Other</h1>}
      </Container>
    </>
  );
};
