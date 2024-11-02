import { Loan } from "@prisma/client";

interface LoanSubmittedProps {}

const LoanSubmitted: React.FC<Readonly<LoanSubmittedProps>> = ({
  payload,
}: {
  payload: { loan: Loan };
}) => (
  <>
    <h3>A new loan application has been submitted.</h3>
    <p>
      View the loan details{" "}
      <a href={`https://www.lendkept.com/loans/${payload.loan.id}`}>here</a>.
    </p>
  </>
);

export default LoanSubmitted;
