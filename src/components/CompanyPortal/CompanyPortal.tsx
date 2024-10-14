import { useState } from "react";
import { EyeIcon, TrashIcon } from "@heroicons/react/20/solid";
import { useRouter } from "next/router";
import { Column, PageContainer } from "../Layout/PageParts";
import { Loan, Partner } from "@prisma/client";

const CompanyPortal = ({
  loans,
  partners,
}: {
  loans: Loan[];
  partners: Partner[];
}) => {
  const router = useRouter();

  const [message, setMessage] = useState("");
  const [messageHistory, setMessageHistory] = useState([
    "Welcome to our loan service!",
    // Add more messages as needed
  ]);

  const [companyDetails, setCompanyDetails] = useState({
    name: "",
    address: "",
    phone: "",
  });

  const handleStatusChange = (loanId, newStatus) => {
    // Implement status change logic here
  };

  const handleSendMessage = () => {
    setMessageHistory([...messageHistory, message]);
    setMessage("");
  };

  const handleUpdateDetails = (e) => {
    e.preventDefault();
    // Implement update logic here
  };

  const handleProcessPayouts = () => {
    // Implement payout processing logic here
  };

  return (
    <PageContainer>
      <Column col={8}>
        {/* My Loans Panel */}
        <div className="bg-white shadow rounded-lg py-2 flex flex-col flex-grow">
          <h2 className="text-xl font-semibold text-gray-900 mb-2 px-4">
            My Loans
          </h2>
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
                    View
                  </th>
                  <th className="py-2 px-4 border-b border-gray-300 bg-gray-100 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Referred By
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loans.length ? (
                  loans.map((loan) => (
                    <tr key={loan.id}>
                      <td className="py-2 px-4 whitespace-nowrap">
                        {loan.addressLine1}
                      </td>
                      <td className="py-2 px-4 whitespace-nowrap">
                        ${loan.loanAmount.toLocaleString()}
                      </td>
                      <td className="py-2 px-4 whitespace-nowrap">
                        <select
                          disabled
                          className=" rounded-lg p-2 brightness-95"
                          value={loan.status}
                        >
                          <option value="SUBMITTED" disabled>
                            Submitted
                          </option>
                          <option value="PROCESSING">Processing</option>
                          <option value="FUNDED">Funded</option>
                          <option value="CANCELLED">Cancelled</option>
                        </select>
                      </td>
                      <td className="text-center py-2 px-4 whitespace-nowrap">
                        <button
                          onClick={() => router.push(`/loans/${loan.id}`)}
                        >
                          <EyeIcon className="h-5 w-5 text-gray-500" />
                        </button>
                      </td>
                      <td className="py-2 px-4 whitespace-nowrap text-center">
                        {/* @ts-ignore */}
                        {loan.partner ? loan.partner.name : "-"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      className="py-2 px-4 whitespace-nowrap text-center"
                      colSpan={4}
                    >
                      <div>No loans yet</div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        {/* Referred Partners Panel */}
        <div className="bg-white shadow rounded-lg py-2 flex flex-col flex-grow">
          <div className="flex items-center justify-between mb-2 px-4">
            <h2 className="text-xl font-semibold text-gray-900">Partners</h2>
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
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {partners.length ? (
                  partners.map((partner) => (
                    <tr key={partner.id}>
                      <td className="py-2 px-4 whitespace-nowrap">
                        {partner.name}
                      </td>
                      <td className="py-2 px-4 whitespace-nowrap">
                        {partner.email}
                      </td>
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
      </Column>

      {/* Right Column */}
      <Column col={4}>
        {/* Company Details Panel */}
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Company Details
          </h2>
          <form onSubmit={handleUpdateDetails}>
            <div className="mb-4">
              <label className="block text-gray-700">Company Name</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg p-2"
                placeholder="Company Name"
                value={companyDetails.name}
                onChange={(e) =>
                  setCompanyDetails({
                    ...companyDetails,
                    name: e.target.value,
                  })
                }
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Address</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg p-2"
                placeholder="Address"
                value={companyDetails.address}
                onChange={(e) =>
                  setCompanyDetails({
                    ...companyDetails,
                    address: e.target.value,
                  })
                }
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Phone</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg p-2"
                placeholder="Phone"
                value={companyDetails.phone}
                onChange={(e) =>
                  setCompanyDetails({
                    ...companyDetails,
                    phone: e.target.value,
                  })
                }
              />
            </div>
            <button className="bg-green-500 text-white py-2 px-4 rounded-lg">
              Update Details
            </button>
          </form>
        </div>

        {/* Payouts Panel */}
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Payouts</h2>
          <p>Manage your partner payouts here.</p>
          <button
            className="mt-2 bg-blue-500 text-white py-2 px-4 rounded-lg"
            onClick={handleProcessPayouts}
          >
            Process Payouts
          </button>
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
            className="mt-2 bg-blue-500 text-white py-2 px-4 rounded-lg"
            onClick={handleSendMessage}
          >
            Send Message
          </button>
          <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-4">
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
                  <button className="text-blue-600 hover:text-blue-900 mr-2">
                    Edit
                  </button>
                  <button className="text-red-400 hover:text-red-900">
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
