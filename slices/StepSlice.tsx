import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/store/store";

// Define a type for the slice state
interface StepState {
  currentStep: number;
  steps: {
    id: number;
    title: string;
    description: string;
    stepNumber: number;
  }[];
}

// Define the initial state using that type
const initialState: StepState = {
  currentStep: 1,
  steps: [
    {
      id: 1,
      title: "Step 1",
      stepNumber: 1,
      description: "Personal Details",
    },
    {
      id: 2,
      title: "Step 2",
      stepNumber: 2,
      description: "KYC Details",
    },
    {
      id: 3,
      title: "Step 3",
      stepNumber: 3,
      description: "Bank Information",
    },
  ],
};

export const stepSlice = createSlice({
  name: "step",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    nextStep: (state) => {
      if (state.currentStep < 4) state.currentStep += 1;
    },
    previousStep: (state) => {
      if (state.currentStep > 1) state.currentStep -= 1;
    },
  },
});

export const { nextStep, previousStep } = stepSlice.actions;

export default stepSlice.reducer;
