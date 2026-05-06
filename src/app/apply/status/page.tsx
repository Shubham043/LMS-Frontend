"use client";
import { useEffect, useState } from "react";
import { Loan } from "@/types";
import { StatusBadge } from "@/components/ui/Badge";
import api from "@/lib/api";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
const fmtDate = (d?: string) => d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";

export default function StatusPage() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/api/borrower/my-loans")
      .then((r) => setLoans(r.data.loans))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center py-16">
      <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!loans.length) return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 text-center">
      <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h2 className="text-lg font-semibold text-slate-900 mb-1">Application Submitted!</h2>
      <p className="text-slate-500 text-sm">Your loan application has been received. Our team will review it shortly.</p>
    </div>
  );

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-slate-900">My Loans</h1>
      {loans.map((loan) => (
        <div key={loan._id} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-2xl font-bold text-slate-900">{fmt(loan.amount)}</p>
              <p className="text-sm text-slate-500">{loan.tenure} days • {loan.interestRate}% p.a.</p>
            </div>
            <StatusBadge status={loan.status} />
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm mb-4">
            <div>
              <p className="text-slate-500">Simple Interest</p>
              <p className="font-semibold text-amber-600">{fmt(loan.simpleInterest)}</p>
            </div>
            <div>
              <p className="text-slate-500">Total Repayment</p>
              <p className="font-semibold">{fmt(loan.totalRepayment)}</p>
            </div>
            <div>
              <p className="text-slate-500">Applied On</p>
              <p className="font-medium">{fmtDate(loan.appliedAt)}</p>
            </div>
            {loan.status === "disbursed" && (
              <>
                <div>
                  <p className="text-slate-500">Total Paid</p>
                  <p className="font-semibold text-emerald-600">{fmt(loan.totalPaid)}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-slate-500 mb-1">Repayment Progress</p>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div
                      className="bg-emerald-500 h-2 rounded-full transition-all"
                      style={{ width: `${Math.min(100, (loan.totalPaid / loan.totalRepayment) * 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-400 mt-1">Outstanding: {fmt(loan.outstandingBalance)}</p>
                </div>
              </>
            )}
          </div>

          {loan.status === "rejected" && loan.rejectionReason && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">
              <span className="font-medium text-black">Rejection reason: </span>{loan.rejectionReason}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}