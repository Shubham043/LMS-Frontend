import { Loan, User } from "@/types";
import { StatusBadge } from "@/components/ui/Badge";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

const fmtDate = (d?: string) => d ? new Date(d).toLocaleDateString("en-IN") : "—";

interface Column {
  key: string;
  header: string;
  render: (loan: Loan) => React.ReactNode;
}

interface LoanTableProps {
  loans: Loan[];
  columns?: Column[];
  actions?: (loan: Loan) => React.ReactNode;
  emptyMessage?: string;
  loading?: boolean;
}

const getBorrower = (loan: Loan): User | null => {
  if (typeof loan.borrower === "object" && loan.borrower !== null) return loan.borrower as User;
  return null;
};

export const defaultColumns: Column[] = [
  {
    key: "borrower",
    header: "Borrower",
    render: (loan) => {
      const b = getBorrower(loan);
      return (
        <div>
          <p className="font-medium text-slate-900">{b?.fullName || "—"}</p>
          <p className="text-xs text-slate-500">{b?.email || String(loan.borrower)}</p>
        </div>
      );
    },
  },
  {
    key: "pan",
    header: "PAN",
    render: (loan) => <span className="font-mono text-sm">{getBorrower(loan)?.pan || "—"}</span>,
  },
  {
    key: "amount",
    header: "Amount",
    render: (loan) => <span className="font-semibold">{fmt(loan.amount)}</span>,
  },
  {
    key: "repayment",
    header: "Total Repayment",
    render: (loan) => <span>{fmt(loan.totalRepayment)}</span>,
  },
  {
    key: "tenure",
    header: "Tenure",
    render: (loan) => <span>{loan.tenure} days</span>,
  },
  {
    key: "status",
    header: "Status",
    render: (loan) => <StatusBadge status={loan.status} />,
  },
  {
    key: "appliedAt",
    header: "Applied",
    render: (loan) => <span className="text-slate-500 text-sm">{fmtDate(loan.appliedAt)}</span>,
  },
];

export const LoanTable = ({
  loans,
  columns = defaultColumns,
  actions,
  emptyMessage = "No loans found",
  loading,
}: LoanTableProps) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!loans.length) {
    return (
      <div className="text-center py-16 text-slate-500">
        <svg className="w-12 h-12 mx-auto mb-3 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-100">
            {columns.map((col) => (
              <th key={col.key} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {col.header}
              </th>
            ))}
            {actions && <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {loans.map((loan) => (
            <tr key={loan._id} className="hover:bg-slate-50 transition-colors">
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-3">{col.render(loan)}</td>
              ))}
              {actions && (
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">{actions(loan)}</div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};