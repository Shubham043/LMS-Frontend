"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { StepIndicator } from "@/components/borrower/StepIndicator";
import api from "@/lib/api";

export default function PersonalDetailsPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    fullName: "",
    pan: "",
    dateOfBirth: "",
    monthlySalary: "",
    employmentMode: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [breError, setBreError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setBreError("");
    setLoading(true);
    try {
      await api.post("/api/borrower/personal-details", {
        ...form,
        monthlySalary: Number(form.monthlySalary),
      });
      router.push("/apply/upload-slip");
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Something went wrong";
      const reason = err?.response?.data?.reason;
      if (err?.response?.status === 422) {
        setBreError(reason || msg);
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
      <StepIndicator current={2} />
      <h1 className="text-xl font-bold text-slate-900 mb-1">Personal Details</h1>
      <p className="text-sm text-slate-500 mb-6">We'll check your eligibility instantly</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Full Name"
          placeholder="As per PAN card"
          value={form.fullName}
          onChange={(e) => setForm({ ...form, fullName: e.target.value })}
          required
        />
        <Input
          label="PAN Number"
          placeholder="ABCDE1234F"
          value={form.pan}
          onChange={(e) => setForm({ ...form, pan: e.target.value.toUpperCase() })}
          maxLength={10}
          hint="Format: 5 letters + 4 digits + 1 letter"
          required
        />
        <Input
          label="Date of Birth"
          type="date"
          value={form.dateOfBirth}
          onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })}
          hint="Must be between 23 and 50 years of age"
          required
        />
        <Input
          label="Monthly Salary (₹)"
          type="number"
          placeholder="e.g. 35000"
          value={form.monthlySalary}
          onChange={(e) => setForm({ ...form, monthlySalary: e.target.value })}
          hint="Minimum ₹25,000 required"
          required
        />
        <Select
          label="Employment Mode"
          value={form.employmentMode}
          onChange={(e) => setForm({ ...form, employmentMode: e.target.value })}
          options={[
            { value: "salaried", label: "Salaried" },
            { value: "self-employed", label: "Self-Employed" },
            { value: "unemployed", label: "Unemployed" },
          ]}
          required
        />

        {/* BRE rejection — prominent red box */}
        {breError && (
          <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-red-800 text-sm">Eligibility Check Failed</p>
                <p className="text-red-700 text-sm mt-0.5">{breError}</p>
              </div>
            </div>
          </div>
        )}

        {error && <p className="text-sm text-red-600">{error}</p>}

        <Button type="submit" className="w-full" size="lg" loading={loading}>
          Check Eligibility →
        </Button>
      </form>
    </div>
  );
}