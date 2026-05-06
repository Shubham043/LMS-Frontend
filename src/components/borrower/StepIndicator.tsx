import { cn } from "@/lib/utils";

const steps = [
  { num: 1, label: "Account" },
  { num: 2, label: "Eligibility" },
  { num: 3, label: "Documents" },
  { num: 4, label: "Loan" },
];

export const StepIndicator = ({ current }: { current: number }) => (
  <div className="flex items-center justify-center mb-8">
    {steps.map((step, i) => (
      <div key={step.num} className="flex items-center">
        <div className="flex flex-col items-center">
          <div
            className={cn(
              "w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-all",
              step.num < current
                ? "bg-emerald-600 border-emerald-600 text-white"
                : step.num === current
                ? "bg-white border-emerald-600 text-emerald-600"
                : "bg-white border-slate-200 text-slate-400"
            )}
          >
            {step.num < current ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              step.num
            )}
          </div>
          <span
            className={cn(
              "mt-1 text-xs font-medium",
              step.num === current ? "text-emerald-600" : "text-slate-400"
            )}
          >
            {step.label}
          </span>
        </div>
        {i < steps.length - 1 && (
          <div
            className={cn(
              "w-16 h-0.5 mx-2 mb-4 transition-colors",
              step.num < current ? "bg-emerald-600" : "bg-slate-200"
            )}
          />
        )}
      </div>
    ))}
  </div>
);