"use client";
import { useEffect, useState } from "react";
import { User } from "@/types";
import { BreBadge } from "@/components/ui/Badge";
import api from "@/lib/api";

export default function SalesPage() {
  const [leads, setLeads] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/api/dashboard/sales/leads")
      .then((r) => setLeads(r.data.leads))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Sales — Lead Tracking</h1>
        <p className="text-slate-500 text-sm mt-1">Registered borrowers who haven't applied yet</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <span className="font-semibold text-slate-900">All Leads</span>
          <span className="bg-slate-100 text-slate-600 text-xs font-medium px-2.5 py-1 rounded-full">{leads.length} total</span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : leads.length === 0 ? (
          <div className="text-center py-16 text-slate-400">No leads yet</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  {["Name", "Email", "PAN", "Monthly Salary", "Employment", "Eligibility", "Registered"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {leads.map((lead) => (
                  <tr key={lead._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-900">{lead.fullName || "—"}</td>
                    <td className="px-4 py-3 text-slate-600">{lead.email}</td>
                    <td className="px-4 py-3 font-mono text-sm">{lead.pan || "—"}</td>
                    <td className="px-4 py-3">
                      {lead.monthlySalary
                        ? new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(lead.monthlySalary)
                        : "—"}
                    </td>
                    <td className="px-4 py-3 capitalize">{lead.employmentMode || "—"}</td>
                    <td className="px-4 py-3"><BreBadge status={lead.breStatus} /></td>
                    <td className="px-4 py-3 text-slate-500">
                      {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString("en-IN") : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}