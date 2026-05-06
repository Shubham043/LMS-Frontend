"use client";
import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Loan } from "@/types";

interface PaymentModalProps {
  loan: Loan | null;
  onClose: () => void;
  onSubmit: (loanId: string, data: { utrNumber: string; amount: number; paymentDate: string; notes?: string }) => Promise<void>;
}

const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(n);

export const PaymentModal = ({ loan, onClose, onSubmit }: PaymentModalProps) => {
  const [form, setForm] = useState({ utrNumber: "", amount: "", paymentDate: new Date().toISOString().split("T")[0], notes: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!loan) return null;
  const borrower = typeof loan.borrower === "object" ? loan.borrower : null;

  const handleSubmit = async () => {
    if (!form.utrNumber.trim()) { setError("UTR number is required"); return; }
    const amt = Number(form.amount);
    if (!amt || amt <= 0) { setError("Enter a valid amount"); return; }
    if (amt > loan.outstandingBalance) { setError(`Amount exceeds outstanding balance (${fmt(loan.outstandingBalance)})`); return; }
    if (!form.paymentDate) { setError("Payment date is required"); return; }

    setLoading(true);
    setError("");
    try {
      await onSubmit(loan._id, { utrNumber: form.utrNumber.trim(), amount: amt, paymentDate: form.paymentDate, notes: form.notes.trim() || undefined });
      onClose();
    } catch (e: any) {
      setError(e?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={!!loan} onClose={onClose} title="Record Payment">
      <div className="space-y-4">
        <div className="bg-slate-50 rounded-xl p-4 space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-slate-500">Borrower</span><span className="font-medium">{borrower?.fullName || "—"}</span></div>
          <div className="flex justify-between"><span className="text-slate-500">Total Repayment</span><span className="font-semibold">{fmt(loan.totalRepayment)}</span></div>
          <div className="flex justify-between"><span className="text-slate-500">Total Paid</span><span className="text-emerald-600 font-semibold">{fmt(loan.totalPaid)}</span></div>
          <div className="flex justify-between border-t border-slate-200 pt-2">
            <span className="text-slate-700 font-medium">Outstanding</span>
            <span className="font-bold text-red-600">{fmt(loan.outstandingBalance)}</span>
          </div>
        </div>

        <Input
          label="UTR Number *"
          placeholder="e.g. HDFC123456789012"
          value={form.utrNumber}
          onChange={(e) => setForm({ ...form, utrNumber: e.target.value.toUpperCase() })}
          hint="Must be unique across all payments"
        />
        <Input
          label="Payment Amount (₹) *"
          type="number"
          placeholder={`Max: ${loan.outstandingBalance.toFixed(2)}`}
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
        />
        <Input
          label="Payment Date *"
          type="date"
          value={form.paymentDate}
          onChange={(e) => setForm({ ...form, paymentDate: e.target.value })}
        />
        <div>
          <label className="text-sm font-medium text-slate-700 block mb-1">Notes (optional)</label>
          <textarea
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
            rows={2}
            placeholder="Any remarks..."
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex gap-2 pt-1">
          <Button variant="secondary" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button className="flex-1" loading={loading} onClick={handleSubmit}>Record Payment</Button>
        </div>
      </div>
    </Modal>
  );
};