import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { nextStep, previousStep } from "@/slices/StepSlice";
import { KYCForms } from "@/components/Forms/KYCForms";
import { FadeIn, FadeInStagger } from "@/components/FadeIn";
import withAuth from "@/HOC/withAuth";

function Dashboard() {
  const { currentStep, steps } = useAppSelector((state) => state.step);
  const dispatch = useAppDispatch();

  return (
    <>
      <div className="grid lg:grid-cols-[1fr,2fr] gap min-h-screen overflow-y-scroll">
        <div className="relative bg-black hidden lg:flex lg:items-center lg:justify-center">
          <div className="fixed top-1/3">
            {steps.map((item) => (
              <Step
                key={item.id}
                currentStep={currentStep}
                step={item}
                stepOrder={item.stepNumber}
              />
            ))}
          </div>
        </div>
        <div className="">
          <KYCForms />
        </div>
      </div>
    </>
  );
}

const Step = ({ step, stepOrder, currentStep }: any) => {
  const status =
    currentStep === stepOrder
      ? "active"
      : currentStep > stepOrder
      ? "complete"
      : "inactive";

  return (
    <>
      <FadeIn>
        <div className="flex">
          <div className="flex flex-col items-center mr-10">
            <div>
              <div
                className={`flex items-center justify-center w-10 h-10 border rounded-full transition-all duration-75 ${
                  status === "active" ? "border-red-400" : ""
                }`}
              >
                <motion.div
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
      </FadeIn>
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

export default withAuth(Dashboard);
