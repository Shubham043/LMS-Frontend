import { LoanStatus } from "@/types";
import { cn } from "@/lib/utils";

const statusConfig: Record<LoanStatus, { label: string; className: string }> = {
  pending:    { label: "Pending",    className: "bg-amber-100 text-amber-700 border-amber-200" },
  approved:   { label: "Approved",   className: "bg-blue-100 text-blue-700 border-blue-200" },
  rejected:   { label: "Rejected",   className: "bg-red-100 text-red-700 border-red-200" },
  disbursed:  { label: "Disbursed",  className: "bg-purple-100 text-purple-700 border-purple-200" },
  closed:     { label: "Closed",     className: "bg-emerald-100 text-emerald-700 border-emerald-200" },
};

export const StatusBadge = ({ status }: { status: LoanStatus }) => {
  const config = statusConfig[status];
  return (
    <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border", config.className)}>
      {config.label}
    </span>
  );
};

export const BreBadge = ({ status }: { status?: string }) => {
  const map: Record<string, { label: string; className: string }> = {
    passed:  { label: "Eligible",    className: "bg-emerald-100 text-emerald-700 border-emerald-200" },
    failed:  { label: "Rejected",    className: "bg-red-100 text-red-700 border-red-200" },
    pending: { label: "Not Checked", className: "bg-slate-100 text-slate-600 border-slate-200" },
  };
  const config = map[status ?? "pending"];
  return (
    <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border", config.className)}>
      {config.label}
    </span>
  );
};