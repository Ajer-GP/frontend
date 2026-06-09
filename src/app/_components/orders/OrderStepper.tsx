const STEPS = [
  { label: "إرسال طلب التأجير" },
  { label: "انتظار القبول" },
  { label: "دفع العربون" },
  { label: "التوصيل" },
  { label: "فترة التأجير" },
  { label: "إرجاع المنتج" },
];

export default function OrderStepper({ currentStep }: { currentStep: number }) {
  return (
    <div dir="rtl" className="flex items-start justify-between w-full py-4">
      {STEPS.map((step, i) => {
        const stepNum = i + 1;
        const done = stepNum < currentStep;
        const active = stepNum === currentStep;
        const lineActive = stepNum < currentStep; // line after this step is "done"

        return (
          <div key={i} className="flex items-start flex-1">
            {/* Circle + label */}
            <div className="flex flex-col items-center gap-1 flex-1">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium border-2
                  ${done ? "bg-brand-primary border-brand-primary text-white" : ""}
                  ${active ? "border-brand-primary text-brand-primary bg-[#E8F0ED]  border-[1px]" : ""}
                  ${!done && !active ? "border-[#8A8A8A] border-[1px] text-[#515151]" : ""}
                `}
              >
                {done ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m4.5 12.75 6 6 9-13.5"
                    />
                  </svg>
                ) : (
                  stepNum
                )}
              </div>
              <span className="text-caption text-text-secondary text-center leading-tight">
                {step.label}
              </span>
            </div>

            {/* Connector line — skip after last step */}
            {i < STEPS.length - 1 && (
              <div
                className={`h-0.5 flex-1 mt-4  transition-colors duration-300
                  ${lineActive ? "bg-brand-primary" : "bg-[#CFCFCF]"}
                `}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
