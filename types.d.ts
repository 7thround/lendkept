// partner: {
//   name: string;
// };
// address: {
//   id: string;
//   addressLine1: string;
//   addressLine2: string | null;
//   city: string;
//   state: string;
//   zip: string;
// };
// } & {
//   id: string;
//   clientName: string;
//   clientPhone: string;
//   ... 7 more ...;
//   companyId: string;
// })[]

import { Loan } from "@prisma/client";

type LoanWithAddress = Loan & {
  address: {
    id: string;
    addressLine1: string;
    addressLine2: string | null;
    city: string;
    state: string;
    zip: string;
  };
};