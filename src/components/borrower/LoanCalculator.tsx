import { LoanCalculation } from "@/types";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

export const LoanCalculator = ({ calc }: { calc: LoanCalculation }) => (
  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 space-y-3">
    <h3 className="text-sm font-semibold text-emerald-800 uppercase tracking-wide">Live Calculation</h3>
    <div className="grid grid-cols-2 gap-3">
      <div>
        <p className="text-xs text-slate-500">Principal</p>
        <p className="text-base font-bold text-slate-900">{fmt(calc.principal)}</p>
      </div>
      <div>
        <p className="text-xs text-slate-500">Tenure</p>
        <p className="text-base font-bold text-slate-900">{calc.tenure} days</p>
      </div>
      <div>
        <p className="text-xs text-slate-500">Interest Rate</p>
        <p className="text-base font-bold text-slate-900">{calc.interestRate}% p.a.</p>
      </div>
      <div>
        <p className="text-xs text-slate-500">Simple Interest</p>
        <p className="text-base font-bold text-amber-600">{fmt(calc.simpleInterest)}</p>
      </div>
    </div>
    <div className="border-t border-emerald-200 pt-3">
      <p className="text-xs text-slate-500">Total Repayment</p>
      <p className="text-2xl font-bold text-emerald-700">{fmt(calc.totalRepayment)}</p>
      <p className="text-xs text-slate-400 mt-1">
        SI = (P × R × T) / (365 × 100) = ({fmt(calc.principal)} × {calc.interestRate} × {calc.tenure}) / 36500
      </p>
    </div>
  </div>
);