import { useState } from "react";
import { EyeIcon, TrashIcon } from "@heroicons/react/20/solid";
import { useRouter } from "next/router";
import { Column, PageContainer } from "../Layout/PageParts";
import { Company, Partner, User } from "@prisma/client";
import { DEFAULT_PASSWORD, LoanStatusLabels } from "../../constants";
import { LoanWithAddress } from "../../../types";
import axios from "axios";
import { pages } from "next/dist/build/templates/app-page";

const LoanAdminsPanel = ({ company, loanAdmins }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");

  const handleCreateUser = async () => {
    try {
      const response = await axios.post("/api/users", {
        name: userName,
        email: userEmail,
        password: DEFAULT_PASSWORD,
        role: "LOAN_ADMIN",
        companyId: company.id,
      });

      if (response.status === 201) {
        console.log("User created successfully:", response.data);
        alert("User created successfully");
        window.location.reload();
      }
    } catch (error) {
      console.error("Error creating user:", error);
    } finally {
      setModalOpen(false);
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      const response = await axios.delete(`/api/users/${id}`);

      if (response.status === 204) {
        console.log("User deleted successfully:", response.data);
        alert("User deleted successfully");
        window.location.reload();
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg mt-4">
      <div className="flex items-center justify-between mb-2 pt-2 px-4">
        <h2 className="text-xl font-semibold text-gray-900">Loan Admins</h2>
        <button
          className="bg-[#e74949] text-white my-1 py-1 px-3 rounded-lg text-sm"
          onClick={() => setModalOpen(true)}
        >
          New Admin
        </button>
      </div>
      <ul className="divide-y divide-gray-200 px-4">
        {loanAdmins.map((admin) => (
          <li key={admin.id} className="py-2 flex justify-between items-center">
            <span>{admin.name}</span>
            <div>
              <button
                className="text-[#e74949] hover:text-blue-900"
                onClick={() => handleDeleteUser(admin.id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Create New Admin</h3>
            <input
              type="text"
              placeholder="Name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="border mb-2 p-2 w-full"
            />
            <input
              type="email"
              placeholder="Email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              className="border mb-4 p-2 w-full"
            />
            <div className="flex justify-end">
              <button
                className="bg-gray-300 text-black py-1 px-3 rounded-lg mr-2"
                onClick={() => setModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-[#e74949] text-white py-1 px-3 rounded-lg"
                onClick={handleCreateUser}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
const CompanyPortal = ({
  loans,
  partners,
  company,
  user,
  loanAdmins,
}: {
  loans: LoanWithAddress[];
  partners: Partner[];
  company: Company;
  user: User;
  loanAdmins: User[];
}) => {
  const router = useRouter();

  const [message, setMessage] = useState("");
  const [messageHistory, setMessageHistory] = useState([
    "Welcome to our loan service!",
  ]);

  const handleSendMessage = () => {
    setMessageHistory([...messageHistory, message]);
    setMessage("");
  };

  const [search, setSearch] = useState("");
  const [filteredLoans, setFilteredLoans] = useState(loans);

  const handleSearch = () => {
    setFilteredLoans(
      loans.filter((loan) =>
        loan.address.addressLine1.toLowerCase().includes(search.toLowerCase())
      )
    );
  };

  const handleDeleteLoan = async (id: string) => {
    const res = await fetch(`/api/loans/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setFilteredLoans(filteredLoans.filter((loan) => loan.id !== id));
      alert("Loan deleted successfully");
    }
  };

  const handleDeletePartner = async (id: string) => {
    const res = await fetch(`/api/partners/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setFilteredLoans(filteredLoans.filter((partner) => partner.id !== id));
      alert("Partner deleted successfully");
    }
  };

  return (
    <PageContainer>
      <Column col={8}>
        {/* My Loans Panel */}
        <div className="bg-white shadow rounded-lg pt-2 overflow-hidden flex flex-col flex-grow">
          <div className="flex items-center justify-between mb-2 px-4">
            <h2 className="text-xl font-semibold text-gray-900">
              {`Welcome back, ${user.name}` || company.name}
            </h2>
            <div className="flex items-center">
              <input
                className="border border-gray-300 rounded-lg p-1 px-3"
                placeholder="Search by address"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button
                className="bg-[#e74949] text-white py-1 px-3 rounded-lg ml-2"
                onClick={handleSearch}
              >
                Search
              </button>
              <button
                className="border border-gray-300 text-gray-500 py-1 px-3 rounded-lg ml-2"
                onClick={() => router.push(`${company.slug}/new-loan`)}
              >
                New Loan
              </button>
            </div>
          </div>
          <div className="overflow-x-auto flex-grow flex flex-col items-start gap-4">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b border-gray-300 bg-gray-100 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Address
                  </th>
                  <th className="py-2 px-4 border-b border-gray-300 bg-gray-100 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="py-2 px-4 border-b border-gray-300 bg-gray-100 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="py-2 px-4 border-b border-gray-300 bg-gray-100 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Referred By
                  </th>
                  <th className="py-2 px-4 border-b border-gray-300 bg-gray-100 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLoans.length ? (
                  filteredLoans.map((loan) => (
                    <tr key={loan.id}>
                      <td className="py-3 px-4 whitespace-nowrap">
                        {loan.address.addressLine1}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        ${loan.loanAmount.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        {LoanStatusLabels[loan.status]}
                      </td>
                      <td className="py-2 px-4 whitespace-nowrap text-center">
                        {/* @ts-ignore */}
                        {loan.partner ? loan.partner.name : "-"}
                      </td>
                      <td className="text-center py-2 px-4 whitespace-nowrap">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => router.push(`/loans/${loan.id}`)}
                          >
                            <EyeIcon className="h-5 w-5 text-gray-500 hover:text-gray-900" />
                          </button>
                          <button onClick={() => handleDeleteLoan(loan.id)}>
                            <TrashIcon className="h-5 w-5 text-gray-500 hover:text-gray-900" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      className="py-2 px-4 whitespace-nowrap text-center"
                      colSpan={4}
                    >
                      <div>
                        {filteredLoans.length
                          ? ""
                          : loans.length
                          ? "No loans found"
                          : "No loans yet"}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Column>
      <Column col={4}>
        {/* Referred Partners Panel */}
        <div className="bg-white shadow rounded-lg overflow-hidden flex flex-col flex-grow">
          <div className="flex items-center justify-between mb-2 px-4 pt-2">
            <h2 className="text-xl font-semibold text-gray-900">Partners</h2>
            <button
              className="bg-[#e74949] text-white my-1 py-1 px-3 rounded-lg text-sm"
              onClick={() => router.push(`${company.slug}/register`)}
            >
              New Partner
            </button>
          </div>
          <div className="overflow-x-auto flex-grow flex flex-col items-start gap-4">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b border-gray-300 bg-gray-100 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="py-2 px-4 border-b border-gray-300 bg-gray-100 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  {/* <th className="py-2 px-4 border-b border-gray-300 bg-gray-100 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th> */}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {partners.length ? (
                  partners.map((partner) => (
                    <tr key={partner.id}>
                      <td className="py-3 px-4 whitespace-nowrap">
                        {partner.name}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        {partner.email.toLocaleLowerCase()}
                      </td>
                      {/* <td className="text-center py-2 px-4 whitespace-nowrap">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleDeletePartner(partner.id)}
                          >
                            <TrashIcon className="h-5 w-5 text-gray-500 hover:text-gray-900" />
                          </button>
                        </div>
                      </td> */}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      className="py-2 px-4 whitespace-nowrap text-center"
                      colSpan={2}
                    >
                      <div>No referred partners yet</div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        {/* Loan Admins Panel */}
        <LoanAdminsPanel company={company} loanAdmins={loanAdmins} />
      </Column>
      {/* Message Center Panel */}
      <Column col={12}>
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Message Center
          </h2>
          <textarea
            className="w-full border border-gray-300 rounded-lg p-2"
            rows={5}
            placeholder="Type your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          ></textarea>
          <button
            className="mt-2 bg-[#e74949] text-white py-2 px-4 rounded-lg"
            onClick={handleSendMessage}
          >
            Send Message
          </button>
          <h3 className="text-xl font-semibold text-gray-900 mt-4 ">
            Message History
          </h3>
          <ul className="divide-y divide-gray-200">
            {messageHistory.map((msg, index) => (
              <li
                key={index}
                className="py-2 flex justify-between items-center"
              >
                <span>{msg}</span>
                <div>
                  <button className="text-[#e74949] hover:text-blue-900 mr-2">
                    Edit
                  </button>
                  <button className="text-[#e74949] hover:text-blue-900">
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Column>
    </PageContainer>
  );
};

export default CompanyPortal;
