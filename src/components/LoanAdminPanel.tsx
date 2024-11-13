import { User } from "@prisma/client";
import { sendEmail } from "../utils";

const LoanAdminPanel = ({ selectedAdmin, availableLoanAdmins, loan }) => {
  const handleChange = async (e) => {
    const loanAdminId = e.target.value;
    const payload = {
      ...loan,
      loanAdminId,
    };
    const response = await fetch(`/api/loans/${loan.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      const newAdmin = availableLoanAdmins.find(
        (admin) => admin.id === loanAdminId
      );
      if (newAdmin) {
        await sendEmail({
          to: availableLoanAdmins.find(
            (admin: User) => admin.id === loanAdminId
          ).email,
          subject: "You have been assigned a new loan",
          template: "LoanOfficerAdded",
          payload: { loan },
        });
        console.log(`Email sent to ${newAdmin.email}`);
      }
      const updatedLoan = await response.json();
      console.log("Loan updated:", updatedLoan);
      window.location.reload();
    } else {
      console.error("Failed to update loan");
    }
  };

  return (
    <div className="mt-2">
      <h3 className="font-semibold mb-1">Assigned Admin</h3>
      <select
        onChange={handleChange}
        className="p-2 border rounded w-full"
        value={selectedAdmin?.id}
      >
        <option value="">Select Loan Admin</option>
        {availableLoanAdmins.map((admin) => (
          <option
            key={admin.id}
            value={admin.id}
            selected={selectedAdmin?.id === admin.id}
          >
            {admin.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LoanAdminPanel;
