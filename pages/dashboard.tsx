import { MoveDown, Check } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

export default function Dashboard() {
  const [step, setStep] = useState(1);
  const steps = [
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
  ];

  function nextStep() {
    if (step < 4) setStep((prev) => prev + 1);
  }

  function back() {
    if (step > 1) setStep((prev) => prev - 1);
  }

  console.log(step);

  return (
    <>
      <div className="grid lg:grid-cols-[1fr,2fr] gap min-h-screen overflow-y-scroll">
        <div className="relative bg-black hidden lg:flex lg:items-center lg:justify-center">
          <div className="fixed top-10 left-10">
            <h1 className="text-2xl text-white">
              <span className="font-display font-semibold">Acme</span>Bank.
            </h1>
          </div>
          <div className="fixed top-1/3">
            {steps.map((item) => (
              <Step
                key={item.id}
                currentStep={step}
                step={item}
                stepOrder={item.stepNumber}
                setStep={setStep}
              />
            ))}
          </div>
        </div>
        <div className="">
          {/* <button onClick={back} className="bg-red-300">
            Previous
          </button>
          <button onClick={nextStep} className="bg-yellow-300">
            Next
          </button> */}
        </div>
      </div>
    </>
  );
}

const Step = ({ step, stepOrder, setStep, currentStep }: any) => {
  const status =
    currentStep === stepOrder
      ? "active"
      : currentStep > stepOrder
      ? "complete"
      : "inactive";

  return (
    <>
      <div>
        <div className="flex">
          <div className="flex flex-col items-center mr-10">
            <div>
              <div className="flex items-center justify-center w-10 h-10 border rounded-full">
                <motion.div
                  onClick={() => setStep(stepOrder)}
                  initial={false}
                  animate={status}
                  transition={{ duration: 0.5 }}
                  className="text-white"
                >
                  {status === "complete" ? (
                    <CheckIcon />
                  ) : (
                    <span className="bg-black text-white">{stepOrder}</span>
                  )}
                </motion.div>
              </div>
            </div>
            {step.id === 3 ? "" : <div className="w-px h-full bg-gray-300" />}
          </div>
          <div className="pt-1 pb-8">
            <p className="mb-2 text-lg font-bold text-white">{step.title}</p>
            <p className="text-white/80">{step.description}</p>
          </div>
        </div>
      </div>
    </>
  );
};

function CheckIcon() {
  return (
    <svg
      className={"text-green-500 h-6 w-6"}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 96 960 960"
      stroke="currentColor"
      strokeWidth={80}
    >
      <motion.path
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{
          delay: 0.3,
          type: "tween",
          ease: "easeOut",
          duration: 0.3,
        }}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M378 810 154 586l43-43 181 181 384-384 43 43-427 427Z"
      />
    </svg>
  );
}