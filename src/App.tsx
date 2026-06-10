import useQuoteStore from "./store/useQuoteStore";

import StepOne from "@/components/steps/StepOne";
import StepTwo from "@/components/steps/StepTwo";
import StepThree from "@/components/steps/StepThree";

function App() {
  const step = useQuoteStore((state) => state.step);
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      {step === 1 && <StepOne />}
      {step === 2 && <StepTwo />}
      {step === 3 && <StepThree />}
    </div>
  );
}

export default App;
