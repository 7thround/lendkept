import { Loan } from "@prisma/client";

interface LoanFundedProps {}

const LoanFunded: React.FC<Readonly<LoanFundedProps>> = ({
  payload,
}: {
  payload: { loan: Loan };
}) => (
  <>
    <h3>Your loan has been funded!</h3>
    <p>
      View the loan details{" "}
      <a
        href={`https://www.lendkept.com/loans/${payload.loan.id}/read_only?access_code=${payload.loan.accessCode}`}
      >
        here.
      </a>
    </p>
  </>
);

export default LoanFunded;
