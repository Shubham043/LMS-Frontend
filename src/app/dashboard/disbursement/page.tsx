"use client";
import { useEffect, useState } from "react";
import { Loan } from "@/types";
import { LoanTable, defaultColumns } from "@/components/dashboard/LoanTable";
import { Button } from "@/components/ui/Button";
import api from "@/lib/api";

export default function DisbursementPage() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [disbursing, setDisbursing] = useState<string | null>(null);

  const fetchLoans = () => {
    setLoading(true);
    api.get("/api/dashboard/disbursement/loans")
      .then((r) => setLoans(r.data.loans))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchLoans(); }, []);

  const handleDisburse = async (loanId: string) => {
    setDisbursing(loanId);
    try {
      await api.patch(`/api/dashboard/disbursement/loans/${loanId}/disburse`);
      fetchLoans();
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to disburse");
    } finally {
      setDisbursing(null);
    }
  };

  const columns = defaultColumns.filter((c) => !["status"].includes(c.key));

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Disbursement</h1>
        <p className="text-slate-500 text-sm mt-1">Release funds for approved loan applications</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <span className="font-semibold text-slate-900">Approved Loans</span>
          <span className="bg-blue-100 text-blue-700 text-xs font-medium px-2.5 py-1 rounded-full">{loans.length} ready</span>
        </div>

        <LoanTable
          loans={loans}
          columns={columns}
          loading={loading}
          emptyMessage="No approved loans awaiting disbursement"
          actions={(loan) => (
            <Button
              size="sm"
              loading={disbursing === loan._id}
              onClick={() => handleDisburse(loan._id)}
            >
              Disburse
            </Button>
          )}
        />
      </div>
    </div>
  );
}