import { useState } from "react";
import { EyeIcon, TrashIcon } from "@heroicons/react/20/solid";
import { useRouter } from "next/router";
import { Column, PageContainer } from "../Layout/PageParts";
import { Company, Partner, User } from "@prisma/client";
import { LoanStatusLabels } from "../../constants";
import { LoanWithAddress } from "../../../types";

const LoanAdminPortal = ({
  loans,
  company,
  user,
}: {
  loans: LoanWithAddress[];
  company: Company;
  user: User;
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

  return (
    <PageContainer>
      <Column col={12}>
        {/* My Loans Panel */}
        <div className="bg-white shadow rounded-lg pt-2 overflow-hidden flex flex-col flex-grow">
          <div className="flex items-center justify-between mb-2 px-4">
            <h2 className="text-xl font-semibold text-gray-900">Loans</h2>
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

export default LoanAdminPortal;
