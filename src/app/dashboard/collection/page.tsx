"use client";
import { useEffect, useState } from "react";
import { Loan, Payment } from "@/types";
import { LoanTable } from "@/components/dashboard/LoanTable";
import { PaymentModal } from "@/components/dashboard/PaymentModal";
import { Button } from "@/components/ui/Button";
import api from "@/lib/api";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(n);

export default function CollectionPage() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Loan | null>(null);
  const [payments, setPayments] = useState<Record<string, Payment[]>>({});
  const [expandedLoan, setExpandedLoan] = useState<string | null>(null);

  const fetchLoans = () => {
    setLoading(true);
    api.get("/api/dashboard/collection/loans")
      .then((r) => setLoans(r.data.loans))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchLoans(); }, []);

  const handleRecordPayment = async (
    loanId: string,
    data: { utrNumber: string; amount: number; paymentDate: string; notes?: string }
  ) => {
    await api.post(`/api/dashboard/collection/loans/${loanId}/payments`, data);
    fetchLoans();
    if (expandedLoan === loanId) fetchPayments(loanId);
  };

  const fetchPayments = async (loanId: string) => {
    if (expandedLoan === loanId) { setExpandedLoan(null); return; }
    try {
      const res = await api.get(`/api/dashboard/collection/loans/${loanId}/payments`);
      setPayments((prev) => ({ ...prev, [loanId]: res.data.payments }));
      setExpandedLoan(loanId);
    } catch (e) { console.error(e); }
  };

  const borrower = (loan: Loan) => typeof loan.borrower === "object" ? loan.borrower : null;

  const collectionColumns = [
    {
      key: "borrower",
      header: "Borrower",
      render: (loan: Loan) => {
        const b = borrower(loan);
        return (
          <div>
            <p className="font-medium text-slate-900">{b?.fullName || "—"}</p>
            <p className="text-xs text-slate-500">{b?.email || "—"}</p>
          </div>
        );
      },
    },
    {
      key: "amount",
      header: "Principal",
      render: (loan: Loan) => <span className="font-semibold">{fmt(loan.amount)}</span>,
    },
    {
      key: "totalRepayment",
      header: "Total Due",
      render: (loan: Loan) => <span>{fmt(loan.totalRepayment)}</span>,
    },
    {
      key: "totalPaid",
      header: "Paid",
      render: (loan: Loan) => <span className="text-emerald-600 font-semibold">{fmt(loan.totalPaid)}</span>,
    },
    {
      key: "outstanding",
      header: "Outstanding",
      render: (loan: Loan) => (
        <div>
          <span className="text-red-600 font-bold">{fmt(loan.outstandingBalance)}</span>
          <div className="w-24 bg-slate-100 rounded-full h-1.5 mt-1">
            <div
              className="bg-emerald-500 h-1.5 rounded-full"
              style={{ width: `${Math.min(100, (loan.totalPaid / loan.totalRepayment) * 100)}%` }}
            />
          </div>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-2">
        <h1 className="text-2xl font-bold text-white">Collection</h1>
        <p className="text-slate-500 text-sm mt-1">Record borrower payments and track outstanding balances</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <span className="font-semibold text-slate-900">Active Loans</span>
          <span className="bg-purple-100 text-purple-700 text-xs font-medium px-2.5 py-1 rounded-full">{loans.length} active</span>
        </div>

        <LoanTable
          loans={loans}
          columns={collectionColumns}
          loading={loading}
          emptyMessage="No active disbursed loans"
          actions={(loan) => (
            <div className="flex gap-2">
              <Button size="sm" variant="ghost" onClick={() => fetchPayments(loan._id)}>
                {expandedLoan === loan._id ? "Hide" : "History"}
              </Button>
              <Button size="sm" onClick={() => setSelected(loan)}>
                Record Payment
              </Button>
            </div>
          )}
        />

        {/* Payment history rows */}
        {expandedLoan && payments[expandedLoan] && (
          <div className="border-t border-slate-100 bg-slate-50 px-6 py-4">
            <p className="text-sm font-semibold text-slate-700 mb-3">Payment History</p>
            {payments[expandedLoan].length === 0 ? (
              <p className="text-sm text-slate-400">No payments recorded yet</p>
            ) : (
              <div className="space-y-2">
                {payments[expandedLoan].map((p) => (
                  <div key={p._id} className="flex items-center justify-between bg-white rounded-lg px-4 py-3 border border-slate-100 text-sm">
                    <div>
                      <span className="font-mono text-xs text-slate-500">{p.utrNumber}</span>
                      <p className="text-slate-400 text-xs">{new Date(p.paymentDate).toLocaleDateString("en-IN")}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-emerald-700">{fmt(p.amount)}</p>
                      <p className="text-xs text-slate-400">Balance after: {fmt(p.balanceAfter)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <PaymentModal
        loan={selected}
        onClose={() => setSelected(null)}
        onSubmit={handleRecordPayment}
      />
    </div>
  );
}