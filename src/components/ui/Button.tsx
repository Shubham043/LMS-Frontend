import React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

export const Button = ({
  variant = "primary",
  size = "md",
  loading,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) => {
  const base =
    "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500 active:scale-[0.98]",
    secondary:
      "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 focus:ring-slate-300",
    danger:
      "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    ghost:
      "text-slate-600 hover:bg-slate-100 focus:ring-slate-300",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm gap-1.5",
    md: "px-4 py-2 text-sm gap-2",
    lg: "px-6 py-3 text-base gap-2",
  };

  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </button>
  );
};