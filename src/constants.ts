import { LoanStatus, LoanType } from "@prisma/client";

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

export const LoanStatusColors: { [key in keyof typeof LoanStatus]: string } = {
  POSSIBLE_LOAN: "gray",
  APPLICATION_SUBMITTED: "blue",
  CREDIT_AND_DOCUMENTS: "blue",
  UNDERWRITING: "blue",
  LOAN_FUNDED: "green",
  ON_HOLD: "yellow",
  CANCELLED: "red",
  NOT_QUALIFIED: "red",
};

export const LoanTypeLabels: { [key in keyof typeof LoanType]: string } = {
  EQUITY: "Home Equity",
  HOME_PURCHASE: "Home Purchase",
  REFINANCE: "Refinance",
  GENERAL_PURPOSE: "General Purpose",
};

export const DEFAULT_PASSWORD = "password";

export const StatusToolTips = {
  POSSIBLE_LOAN: "This loan is a possible loan",
  APPLICATION_SUBMITTED: "Application and Credit Check",
  CREDIT_AND_DOCUMENTS: "Documents and Processing",
  UNDERWRITING: "Underwriting",
  LOAN_FUNDED: "Loan Funded",
  ON_HOLD: "On Hold",
  CANCELLED: "Cancelled",
  NOT_QUALIFIED: "Not Qualified",
};