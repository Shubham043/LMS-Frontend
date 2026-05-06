"use client";
import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Loan } from "@/types";

interface SanctionModalProps {
  loan: Loan | null;
  onClose: () => void;
  onSubmit: (loanId: string, action: "approve" | "reject", reason?: string) => Promise<void>;
}

const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

export const SanctionModal = ({ loan, onClose, onSubmit }: SanctionModalProps) => {
  const [action, setAction] = useState<"approve" | "reject" | null>(null);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!loan) return null;

  const borrower = typeof loan.borrower === "object" ? loan.borrower : null;

  const handleSubmit = async () => {
    if (!action) return;
    if (action === "reject" && !reason.trim()) {
      setError("Rejection reason is required");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await onSubmit(loan._id, action, reason.trim() || undefined);
      onClose();
    } catch (e: any) {
      setError(e?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={!!loan} onClose={onClose} title="Review Loan Application">
      <div className="space-y-4">
        <div className="bg-slate-50 rounded-xl p-4 space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-slate-500">Borrower</span><span className="font-medium">{borrower?.fullName || "—"}</span></div>
          <div className="flex justify-between"><span className="text-slate-500">PAN</span><span className="font-mono">{borrower?.pan || "—"}</span></div>
          <div className="flex justify-between"><span className="text-slate-500">Loan Amount</span><span className="font-semibold text-emerald-700">{fmt(loan.amount)}</span></div>
          <div className="flex justify-between"><span className="text-slate-500">Total Repayment</span><span className="font-semibold">{fmt(loan.totalRepayment)}</span></div>
          <div className="flex justify-between"><span className="text-slate-500">Tenure</span><span>{loan.tenure} days</span></div>
          {loan.salarySlipUrl && (
            <div className="flex justify-between">
              <span className="text-slate-500">Salary Slip</span>
              <a href={`${process.env.NEXT_PUBLIC_API_URL}${loan.salarySlipUrl}`} target="_blank" rel="noreferrer" className="text-emerald-600 underline text-xs">View Document</a>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => { setAction("approve"); setError(""); }}
            className={`flex-1 py-2 rounded-lg text-sm font-medium border-2 transition-colors ${action === "approve" ? "border-emerald-600 bg-emerald-50 text-emerald-700" : "border-slate-200 text-slate-600 hover:border-emerald-300"}`}
          >
            ✓ Approve
          </button>
          <button
            onClick={() => { setAction("reject"); setError(""); }}
            className={`flex-1 py-2 rounded-lg text-sm font-medium border-2 transition-colors ${action === "reject" ? "border-red-500 bg-red-50 text-red-700" : "border-slate-200 text-slate-600 hover:border-red-300"}`}
          >
            ✕ Reject
          </button>
        </div>

        {action === "reject" && (
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1">Rejection Reason *</label>
            <textarea
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 resize-none"
              rows={3}
              placeholder="Explain why the loan is being rejected..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
        )}

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex gap-2 pt-1">
          <Button variant="secondary" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button
            className="flex-1"
            variant={action === "reject" ? "danger" : "primary"}
            disabled={!action}
            loading={loading}
            onClick={handleSubmit}
          >
            {action === "approve" ? "Approve Loan" : action === "reject" ? "Reject Loan" : "Select Action"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};