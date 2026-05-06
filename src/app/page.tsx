"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const roleToModule: Record<string, string> = {
  admin: "/dashboard/sales",
  sales: "/dashboard/sales",
  sanction: "/dashboard/sanction",
  disbursement: "/dashboard/disbursement",
  collection: "/dashboard/collection",
};

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
  if (!user) {
    router.replace("/login");
    return;
  }

  const dest = roleToModule[user.role] || "/dashboard/sales";
  router.replace(dest);
}, [user, router]);

  return (
    <div className="flex items-center justify-center h-64">
      <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}