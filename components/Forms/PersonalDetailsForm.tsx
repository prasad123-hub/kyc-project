import { useAppDispatch } from "@/hooks";
import { nextStep } from "@/slices/StepSlice";
import React from "react";

export const PersonalDetailsForm = () => {
  const dispatch = useAppDispatch();
  return (
    <>
      <div className="py-6">
        <h2 className="text-2xl font-medium">Personal Details form</h2>
      </div>
    </>
  );
};
