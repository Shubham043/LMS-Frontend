export type UserRole =
  | "admin"
  | "sales"
  | "sanction"
  | "disbursement"
  | "collection"
  | "borrower";

export type LoanStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "disbursed"
  | "closed";

export type BreStatus = "pending" | "passed" | "failed";
export type EmploymentMode = "salaried" | "self-employed" | "unemployed";

export interface User {
  _id: string;
  email: string;
  role: UserRole;
  fullName?: string;
  pan?: string;
  dateOfBirth?: string;
  monthlySalary?: number;
  employmentMode?: EmploymentMode;
  breStatus?: BreStatus;
  breRejectionReason?: string;
  createdAt?: string;
}

export interface Loan {
  _id: string;
  borrower: User | string;
  amount: number;
  tenure: number;
  interestRate: number;
  simpleInterest: number;
  totalRepayment: number;
  totalPaid: number;
  outstandingBalance: number;
  status: LoanStatus;
  rejectionReason?: string;
  salarySlipUrl?: string;
  appliedAt: string;
  approvedAt?: string;
  rejectedAt?: string;
  disbursedAt?: string;
  closedAt?: string;
  sanctionedBy?: User | string;
  disbursedBy?: User | string;
}

export interface Payment {
  _id: string;
  loan: string;
  borrower: string;
  recordedBy: User | string;
  utrNumber: string;
  amount: number;
  paymentDate: string;
  balanceBefore: number;
  balanceAfter: number;
  notes?: string;
  createdAt: string;
}

export interface LoanCalculation {
  principal: number;
  interestRate: number;
  tenure: number;
  simpleInterest: number;
  totalRepayment: number;
}