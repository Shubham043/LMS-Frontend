"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { StepIndicator } from "@/components/borrower/StepIndicator";
import { LoanCalculator } from "@/components/borrower/LoanCalculator";
import { useLoanCalc } from "@/hooks/useLoanCalc";
import api from "@/lib/api";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

export default function LoanConfigPage() {
  const router = useRouter();
  const [amount, setAmount] = useState(150000);
  const [tenure, setTenure] = useState(180);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const calc = useLoanCalc(amount, tenure);

  const handleApply = async () => {
    setLoading(true);
    setError("");
    try {
      const salarySlipUrl = sessionStorage.getItem("salarySlipUrl") || undefined;
      await api.post("/api/borrower/apply", { amount, tenure, salarySlipUrl });
      sessionStorage.removeItem("salarySlipUrl");
      router.push("/apply/status");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Application failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
      <StepIndicator current={4} />
      <h1 className="text-xl font-bold text-slate-900 mb-1">Configure Your Loan</h1>
      <p className="text-sm text-slate-500 mb-6">Adjust the sliders to find your ideal loan</p>

      {/* Amount Slider */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-slate-700">Loan Amount</label>
          <span className="text-lg font-bold text-emerald-700">{fmt(amount)}</span>
        </div>
        <input
          type="range"
          min={50000}
          max={500000}
          step={5000}
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="w-full accent-emerald-600 h-2 rounded-full cursor-pointer"
        />
        <div className="flex justify-between text-xs text-slate-400 mt-1">
          <span>₹50,000</span>
          <span>₹5,00,000</span>
        </div>
      </div>

      {/* Tenure Slider */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-slate-700">Tenure</label>
          <span className="text-lg font-bold text-emerald-700">{tenure} days</span>
        </div>
        <input
          type="range"
          min={30}
          max={365}
          step={5}
          value={tenure}
          onChange={(e) => setTenure(Number(e.target.value))}
          className="w-full accent-emerald-600 h-2 rounded-full cursor-pointer"
        />
        <div className="flex justify-between text-xs text-slate-400 mt-1">
          <span>30 days</span>
          <span>365 days</span>
        </div>
      </div>

      {/* Live Calculation */}
      <LoanCalculator calc={calc} />

      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      <Button className="w-full mt-5" size="lg" loading={loading} onClick={handleApply}>
        Apply for Loan
      </Button>
    </div>
  );
}