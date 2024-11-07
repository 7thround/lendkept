import { Loan, Partner } from "@prisma/client";

interface LoanSubmittedProps {}

const LoanSubmitted: React.FC<Readonly<LoanSubmittedProps>> = ({
  payload,
}: {
  payload: {
    loan: Loan & {
      borrowerFirstName: string;
      borrowerLastName: string;
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
      A new Loan Application has been submitted by: {payload.partner?.name}
    </h3>
    <h4>Loan Details:</h4>
    <ul>
      <li>Loan Type: {payload.loan.loanType}</li>
      <li>Loan Amount: ${payload.loan.loanAmount.toLocaleString()}</li>
    </ul>
    <h4>Borrower Details:</h4>
    <ul>
      <li>
        Borrower: {payload.loan.borrowerFirstName}{" "}
        {payload.loan.borrowerLastName}
      </li>
      <li>Email: {payload.loan.borrowerEmail}</li>
      <li>Phone: {payload.loan.borrowerPhone}</li>
      <li>Address: {payload.loan.addressLine1}</li>
      <li>City: {payload.loan.city}</li>
      <li>State: {payload.loan.state}</li>
      <li>Zip: {payload.loan.zip}</li>
    </ul>
    <p>
      View the loan details{" "}
      <a href={`https://www.lendkept.com/loans/${payload.loanId}`}>here</a>.
    </p>
  </>
);

export default LoanSubmitted;
