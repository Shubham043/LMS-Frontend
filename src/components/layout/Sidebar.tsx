"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/types";
import { cn } from "@/lib/utils";

const allModules = [
  {
    href: "/dashboard/sales",
    label: "Sales",
    roles: ["admin", "sales"],
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    href: "/dashboard/sanction",
    label: "Sanction",
    roles: ["admin", "sanction"],
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    href: "/dashboard/disbursement",
    label: "Disbursement",
    roles: ["admin", "disbursement"],
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    href: "/dashboard/collection",
    label: "Collection",
    roles: ["admin", "collection"],
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
  },
];

export const Sidebar = () => {
  const { role } = useAuth();
  const pathname = usePathname();

  const modules = allModules.filter((m) => m.roles.includes(role as UserRole));

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-56 bg-slate-900 text-white flex flex-col z-30">
      <div className="p-4 border-b border-slate-700">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Operations</p>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {modules.map((m) => (
          <Link
            key={m.href}
            href={m.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
              pathname.startsWith(m.href)
                ? "bg-emerald-600 text-white"
                : "text-slate-300 hover:bg-slate-800 hover:text-white"
            )}
          >
            {m.icon}
            {m.label}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-slate-700">
        <p className="text-xs text-slate-500">Loan Management System</p>
      </div>
    </aside>
  );
};