"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const roleToRoute = {
  sales: "/dashboard/sales",
  sanction: "/dashboard/sanction",
  disbursement: "/dashboard/disbursement",
  collection: "/dashboard/collection",
  admin: "/dashboard/sales",
  borrower:"/apply/status",
};

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  console.log("DashboardPage render - user:", user, "isLoading:", isLoading);
  useEffect(() => {
    if (isLoading) return;
    if (!user) return;

    const path = roleToRoute[user.role] || "/dashboard/sales";
    router.replace(path);
  }, [user, isLoading, router]);

  return null;
}
