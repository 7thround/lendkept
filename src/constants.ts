import { LoanStatus } from "@prisma/client";

export const LoanStatusLabels: { [key in keyof typeof LoanStatus]: string } = {
  POSSIBLE_LOAN: "Possible Loan",
  APPLICATION_SUBMITTED: "Application Submitted",
  CREDIT_AND_DOCUMENTS: "Credit and Documents",
  UNDERWRITING: "Underwriting",
  LOAN_FUNDED: "Loan Funded",
  ON_HOLD: "On Hold",
  CANCELLED: "Cancelled",
  NOT_QUALIFIED: "Not Qualified",
};