"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import api from "@/lib/api";


export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/api/auth/login", form);
      const { token, user } = res.data;
      login(token, user);
      if (user.role === "borrower") router.push("/apply/personal-details");
      else router.push("/dashboard");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Login failed. Check credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold">CS</span>
          </div>
          <span className="text-white font-bold text-2xl">CreditSea</span>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Welcome back</h1>
          <p className="text-slate-500 text-sm mb-6">Sign in to your account to continue</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" size="lg" loading={loading}>
              Sign In
            </Button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            New borrower?{" "}
            <Link href="/signup" className="text-emerald-600 font-medium hover:underline">
              Create account
            </Link>
          </p>

          {/* Quick credentials hint */}
          <details className="mt-6">
            <summary className="text-xs text-slate-400 cursor-pointer hover:text-slate-600">
              Demo credentials ▸
            </summary>
            <div className="mt-2 bg-slate-50 rounded-lg p-3 space-y-1 text-xs font-mono text-slate-600">
              <p>admin@creditsea.com / Admin@123</p>
              <p>sales@creditsea.com / Sales@123</p>
              <p>sanction@creditsea.com / Sanction@123</p>
              <p>disburse@creditsea.com / Disburse@123</p>
              <p>collection@creditsea.com / Collect@123</p>
              <p>borrower@creditsea.com / Borrower@123</p>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
}