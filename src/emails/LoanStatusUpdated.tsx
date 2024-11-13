import { Loan } from "@prisma/client";

interface LoanStatusUpdatedProps {}

const LoanStatusUpdated: React.FC<Readonly<LoanStatusUpdatedProps>> = ({
  payload,
}: {
  payload: { loan: Loan };
}) => (
  <>
    <h3>Loan Status Updated</h3>
    <p>
      Loan status has been updated to <strong>{payload.loan.status}</strong>.
    </p>
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

export default LoanStatusUpdated;
