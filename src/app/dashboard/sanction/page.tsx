"use client";
import { useEffect, useState } from "react";
import { Loan } from "@/types";
import { LoanTable, defaultColumns } from "@/components/dashboard/LoanTable";
import { SanctionModal } from "@/components/dashboard/SanctionModal";
import { Button } from "@/components/ui/Button";
import api from "@/lib/api";

export default function SanctionPage() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Loan | null>(null);

  const fetchLoans = () => {
    setLoading(true);
    api.get("/api/dashboard/sanction/loans")
      .then((r) => setLoans(r.data.loans))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchLoans(); }, []);

  const handleSanction = async (loanId: string, action: "approve" | "reject", rejectionReason?: string) => {
    await api.patch(`/api/dashboard/sanction/loans/${loanId}`, { action, rejectionReason });
    fetchLoans();
  };

  const columns = defaultColumns.filter((c) => !["status"].includes(c.key));

  return (
  <div className="flex flex-col gap-6">
    
    {/* Header */}
    <div>
      <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Sanction</h1>
      <p className="text-slate-500 text-sm mt-1">
        Review and approve or reject loan applications
      </p>
    </div>

    {/* Table */}
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      
      <div className="px-4 sm:px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <span className="font-semibold text-slate-900">Pending Applications</span>
        <span className="bg-amber-100 text-amber-700 text-xs font-medium px-2.5 py-1 rounded-full">
          {loans.length} pending
        </span>
      </div>

      <div className="overflow-x-auto">
        <LoanTable
          loans={loans}
          columns={columns}
          loading={loading}
          emptyMessage="No pending loan applications"
          actions={(loan) => (
            <Button size="sm" onClick={() => setSelected(loan)}>
              Review
            </Button>
          )}
        />
      </div>
    </div>

    <SanctionModal
      loan={selected}
      onClose={() => setSelected(null)}
      onSubmit={handleSanction}
    />
  </div>
);
}