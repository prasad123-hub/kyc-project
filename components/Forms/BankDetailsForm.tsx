import { useAppDispatch } from "@/hooks";
import { nextStep } from "@/slices/StepSlice";
import React from "react";

export const BankDetailsForm = () => {
  const dispatch = useAppDispatch();
  return (
    <>
      <h1>Bank details forms</h1>
      <button onClick={() => dispatch(nextStep())}>Next</button>
    </>
  );
};
