import { useMemo } from "react";
import { LoanCalculation } from "@/types";

export const useLoanCalc = (amount: number, tenure: number): LoanCalculation => {
  return useMemo(() => {
    const rate = 12;
    const si = (amount * rate * tenure) / (365 * 100);
    return {
      principal: amount,
      interestRate: rate,
      tenure,
      simpleInterest: Math.round(si * 100) / 100,
      totalRepayment: Math.round((amount + si) * 100) / 100,
    };
  }, [amount, tenure]);
};