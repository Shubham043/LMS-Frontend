"use client";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";

export const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-slate-100 shadow-sm h-16">
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">CS</span>
          </div>
          <span className="font-bold text-slate-900 text-lg">CreditSea</span>
        </Link>

        <div className="flex items-center gap-3">
          {user && (
            <>
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-sm font-medium text-slate-900">{user.fullName || user.email}</span>
                <span className="text-xs text-slate-500 capitalize">{user.role}</span>
              </div>
              <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                <span className="text-emerald-700 font-semibold text-sm">
                  {(user.fullName || user.email)[0].toUpperCase()}
                </span>
              </div>
              <Button variant="ghost" size="sm" onClick={logout}>Logout</Button>
            </>
          )}
          {user?.role === "borrower" && (
  <Link href="/apply/status" className="text-sm font-medium text-slate-600 hover:text-emerald-600">
    My Loan
  </Link>
)}
        </div>
      </div>
    </nav>
  );
};