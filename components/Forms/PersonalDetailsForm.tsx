import { useAppDispatch } from "@/hooks";
import { nextStep } from "@/slices/StepSlice";
import React from "react";

export const PersonalDetailsForm = () => {
  const dispatch = useAppDispatch();
  return (
    <>
      <h1>Personal details forms</h1>
      <button onClick={() => dispatch(nextStep())}>Next</button>
    </>
  );
};
