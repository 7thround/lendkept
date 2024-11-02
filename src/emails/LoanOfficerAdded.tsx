import { Loan } from "@prisma/client";

interface LoanOfficerAddedProps {}

const LoanOfficerAdded: React.FC<Readonly<LoanOfficerAddedProps>> = ({
  payload,
}: {
  payload: { loan: Loan };
}) => (
  <>
    <p>You have been assigned as the loan officer</p>
    <p>
      View the loan details{" "}
      <a href={`https://www.lendkept.com/loans/${payload.loan.id}`}>here</a>.
    </p>
  </>
);

export default LoanOfficerAdded;
