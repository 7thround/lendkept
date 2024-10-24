import { Borrower, Loan } from "@prisma/client";

type LoanWithAddress = Loan & {
  address: {
    id: string;
    addressLine1: string;
    addressLine2: string | null;
    city: string;
    state: string;
    zip: string;
  };
  borrowers: Borrower[];
};