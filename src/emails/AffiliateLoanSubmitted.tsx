import { Loan, Partner } from "@prisma/client";

interface AffiliateLoanSubmittedProps {}

const AffiliateLoanSubmitted: React.FC<
  Readonly<AffiliateLoanSubmittedProps>
> = ({
  payload,
}: {
  payload: {
    loan: Loan & {
      borrowerFirstName: string;
      borrowerEmail: string;
      borrowerPhone: string;
      addressLine1: string;
      city: string;
      state: string;
      zip: string;
    };
    loanId: string;
    partner: Partner;
  };
}) => (
  <>
    <h3>
      You have a new affiliate Loan Application from: {payload.partner?.name}
    </h3>
    <ul>
      <li>Loan Type: {payload.loan.loanType}</li>
      <li>Loan Amount: ${payload.loan.loanAmount.toLocaleString()}</li>
      <li>Borrower Loan ID: {payload.loanId}</li>
    </ul>
    <p>
      Log on here to LendKEPT to view the details{" "}
      <a href={`https://www.lendkept.com/`}>LendKEPT.com</a>.
    </p>
  </>
);

export default AffiliateLoanSubmitted;
