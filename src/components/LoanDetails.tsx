import { LoanTypeLabels } from "../constants";
import LoanStatusLabel from "./common/LoanStatusLabel";

const LoanDetails = ({ loan, assignedOfficer }) => (
  <>
    <p>
      <strong>Borrower:</strong> {loan.borrowers[0].firstName}{" "}
      {loan.borrowers[0].lastName}
    </p>
    {loan.borrowers[1] && (
      <p>
        <strong>Co-Borrower:</strong> {loan.borrowers[1].firstName}{" "}
        {loan.borrowers[1].lastName}
      </p>
    )}
    <p>
      <strong>Address:</strong> {`${loan.address.addressLine1}`}
    </p>
    <p>
      <strong>Status:</strong> <LoanStatusLabel status={loan.status} />
    </p>
    <p>
      <strong>Type:</strong> {LoanTypeLabels[loan.loanType]}
    </p>
    <p>
      <strong>Amount:</strong> ${loan.loanAmount.toLocaleString()}
    </p>
    <p>
      <strong>Assigned Officer:</strong> {assignedOfficer?.name || "Unassigned"}
    </p>
  </>
);

export default LoanDetails;
