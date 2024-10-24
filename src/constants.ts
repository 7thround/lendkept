import { LoanStatus } from "@prisma/client";

export const LoanStatusLabels: { [key in keyof typeof LoanStatus]: string } = {
  POSSIBLE_LOAN: "Possible Loan",
  APPLICATION_SUBMITTED: "Application and Credit Check",
  CREDIT_AND_DOCUMENTS: "Documents and Processing",
  UNDERWRITING: "Underwriting",
  LOAN_FUNDED: "Loan Funded",
  ON_HOLD: "On Hold",
  CANCELLED: "Cancelled",
  NOT_QUALIFIED: "Not Qualified",
};

export const DEFAULT_PASSWORD = "password";